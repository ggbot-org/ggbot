import { Buffer } from "node:buffer"
import { IncomingMessage, ServerResponse } from "node:http"

import {
	apiActionMethod,
	ApiActionOutputData,
	ApiActionOutputError
} from "@workspace/api"
import { ErrorBinanceHTTP } from "@workspace/binance"
import {
	BAD_GATEWAY__502,
	BAD_REQUEST__400,
	BadRequestError,
	INTERNAL_SERVER_ERROR__500,
	METHOD_NOT_ALLOWED__405,
	NOT_FOUND__404,
	OK__200,
	UNAUTHORIZED__401
} from "@workspace/http"
import { BinanceProxyURLs } from "@workspace/locators"
import { ErrorAccountItemNotFound } from "@workspace/models"

import { binanceRequestHandler } from "./binanceRequestHandler.js"
import { getElasticIp } from "./elasticIp.js"
import { warn } from "./logging.js"

const ContentTypeJSON = { "Content-Type": "application/json" }

export const requestListener = (
	request: IncomingMessage,
	response: ServerResponse
) => {
	const { url: requestUrl } = request

	if (typeof requestUrl !== "string") {
		response.writeHead(BAD_REQUEST__400)
		response.end()
		return
	}

	if (requestUrl === "/health-check") {
		response.end(`Elastic IP: ${getElasticIp() ?? "none"}`)
		return
	}

	if (requestUrl === "/robots.txt") {
		response.end("User-agent: *\nDisallow: /")
		return
	}

	// Handle known URLs.
	// Use an instance of `BinanceProxyURLs` with `localhost` as base URL,
	// just to get its URLs pathnames.
	const binanceProxy = new BinanceProxyURLs("localhost")

	// The request URL is not known if we arrive here.
	if (requestUrl === `/${binanceProxy.action.pathname}`) {
		warn(NOT_FOUND__404, requestUrl)
		response.writeHead(NOT_FOUND__404)
		response.end()
	}

	if (request.method !== apiActionMethod) {
		response.writeHead(METHOD_NOT_ALLOWED__405)
		response.end()
		return
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
				const output: ApiActionOutputData = { data }
				response.writeHead(OK__200, ContentTypeJSON)
				response.write(JSON.stringify(output))
			})
			.catch((error) => {
				if (error instanceof BadRequestError) {
					response.writeHead(error.statusCode)
					return
				}

				if (error instanceof ErrorAccountItemNotFound) {
					response.writeHead(UNAUTHORIZED__401)
					return
				}

				if (error instanceof ErrorBinanceHTTP) {
					response.writeHead(BAD_GATEWAY__502, ContentTypeJSON)
					const output: ApiActionOutputError = {
						error: {
							name: BadRequestError.errorName,
							info: error.info
						}
					}
					response.write(JSON.stringify(output))
				}

				// Fallback to print out error an return an "Internal Server Error" code.
				warn(error)
				response.writeHead(INTERNAL_SERVER_ERROR__500)
			})
			.finally(() => {
				response.end()
			})
	})
}
