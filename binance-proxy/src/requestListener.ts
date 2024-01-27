import { Buffer } from "node:buffer"
import { IncomingMessage, ServerResponse } from "node:http"

import {
	apiActionMethod,
	isActionInput,
	isBinanceClientActionInput
} from "@workspace/api"
import { readSessionFromAuthorizationHeader } from "@workspace/authentication"
import { ErrorBinanceHTTP } from "@workspace/binance"
import {
	__200__OK__,
	__400__BAD_REQUEST__,
	__401__UNAUTHORIZED__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__,
	BadRequestError
} from "@workspace/http"
import { BinanceProxyURLs } from "@workspace/locators"
import { ErrorAccountItemNotFound } from "@workspace/models"

import { binanceRequestHandler } from "./binanceRequestHandler.js"
import { getElasticIp } from "./elasticIp.js"
import { warn } from "./logging.js"

export const requestListener = (
	request: IncomingMessage,
	response: ServerResponse
) => {
	const { url: requestUrl } = request

	if (typeof requestUrl !== "string") {
		response.writeHead(__400__BAD_REQUEST__)
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

	if (requestUrl === binanceProxy.action.pathname) {
		if (request.method !== apiActionMethod) {
			response.writeHead(__400__BAD_REQUEST__)
			response.end()
			return
		}

		const chunks: Uint8Array[] = []
		request.on("data", (chunk) => chunks.push(chunk as Uint8Array))
		request.on("end", () => {
			const body = Buffer.concat(chunks).toString("utf-8")

			readSessionFromAuthorizationHeader(request.headers.Authorization)
				.then(({ accountId }) => {
					try {
						const input: unknown = JSON.parse(body)
						if (!isActionInput(isBinanceClientActionInput)(input))
							throw new BadRequestError()
						return binanceRequestHandler({ accountId }, input)
					} catch (error) {
						if (error instanceof SyntaxError)
							throw new BadRequestError()
						throw error
					}
				})
				.then(() => {
					response.writeHead(__200__OK__)
				})
				.catch((error) => {
					if (error instanceof BadRequestError) {
						response.writeHead(error.statusCode)
						return
					}

					if (error instanceof ErrorAccountItemNotFound) {
						response.writeHead(__401__UNAUTHORIZED__)
						return
					}

					if (error instanceof ErrorBinanceHTTP) {
						response.writeHead(__200__OK__)
						// const {
						// 	info: { status, statusText },
						// 	payload
						// } = error
						// return {
						// 	status,
						// 	error: payload ?? {
						// 		code: -1,
						// 		msg: statusText
						// 	}
						// }
					}

					// Fallback to print out error an return an "Internal Server Error" code.
					warn(error)
					response.writeHead(__500__INTERNAL_SERVER_ERROR__)
				})
				.finally(() => {
					response.end()
				})
		})
	}

	// The request URL is not known if we arrive here.
	warn(__404__NOT_FOUND__, requestUrl)
	response.writeHead(__404__NOT_FOUND__)
	response.end()
}
