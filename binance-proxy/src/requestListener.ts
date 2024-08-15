import { Buffer } from "node:buffer"
import { IncomingMessage, ServerResponse } from "node:http"

import { apiActionMethod, ApiActionOutputData, ApiActionOutputError } from "@workspace/api"
import { ErrorBinanceHTTP } from "@workspace/binance"
import { BAD_GATEWAY__502, BAD_REQUEST__400, BadGatewayError, BadRequestError, INTERNAL_SERVER_ERROR__500, METHOD_NOT_ALLOWED__405, NOT_FOUND__404, OK__200, UNAUTHORIZED__401 } from "@workspace/http"
import { BinanceProxyURLs } from "@workspace/locators"
import { ErrorAccountItemNotFound } from "@workspace/models"

import { binanceRequestHandler } from "./binanceRequestHandler.js"
import { warn } from "./logging.js"

const ContentTypeJSON = { "Content-Type": "application/json" }

// Use an instance of `BinanceProxyURLs` with `localhost` as base URL,
// just to get its URLs pathnames.
const binanceProxy = new BinanceProxyURLs("localhost")

export function requestListener (request: IncomingMessage, response: ServerResponse) {
	const { method, url } = request

	if (typeof url !== "string") {
		response.writeHead(BAD_REQUEST__400)
		return response.end()
	}

	if (url !== binanceProxy.action.pathname) {
		warn(NOT_FOUND__404, url)
		response.writeHead(NOT_FOUND__404)
		return response.end()
	}

	if (method !== apiActionMethod) {
		response.writeHead(METHOD_NOT_ALLOWED__405)
		return response.end()
	}

	const chunks: Uint8Array[] = []
	request.on("data", (chunk) => chunks.push(chunk as Uint8Array))
	request.on("error", () => {
		response.writeHead(INTERNAL_SERVER_ERROR__500)
		response.end()
	})
	request.on("end", () => {
		const body = Buffer.concat(chunks).toString("utf-8")

		binanceRequestHandler(request.headers, body)
			.then((data) => {
				response.writeHead(OK__200, ContentTypeJSON)
				const output: ApiActionOutputData = { data }
				response.write(JSON.stringify(output), "utf-8")
			})
			.catch((error) => {
				if (error instanceof BadRequestError) return response.writeHead(error.statusCode)

				if (error instanceof ErrorAccountItemNotFound) return response.writeHead(UNAUTHORIZED__401)

				if (error instanceof ErrorBinanceHTTP) {
					response.writeHead(BAD_GATEWAY__502, ContentTypeJSON)
					const output: ApiActionOutputError = { error: { name: BadGatewayError.errorName, info: error.info } }
					return response.write(JSON.stringify(output), "utf-8")
				}

				// Fallback to print out error an return an "Internal Server Error" code.
				console.debug(error)
				response.writeHead(INTERNAL_SERVER_ERROR__500)
			})
			.finally(() => response.end())
	})
}
