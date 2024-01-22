import { IncomingMessage, ServerResponse } from "node:http"

import {
	__200__OK__,
	__400__BAD_REQUEST__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__
} from "@workspace/http"
import { isBinanceProxyPathname } from "@workspace/locators"
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

	if (!isBinanceProxyPathname(requestUrl)) {
		warn(__404__NOT_FOUND__, requestUrl)
		response.writeHead(__404__NOT_FOUND__)
		response.end()
		return
	}

	if (request.method !== "POST") {
		response.writeHead(__400__BAD_REQUEST__)
		response.end()
		return
	}

	binanceRequestHandler(requestUrl, { accountId: "TODO" })
		.then(() => {
			response.writeHead(__200__OK__)
			response.end()
		})
		.catch((error) => {
			if (error instanceof ErrorAccountItemNotFound) {
				response.writeHead(__400__BAD_REQUEST__)
				response.end()
				return
			}
			warn(error)
			response.writeHead(__500__INTERNAL_SERVER_ERROR__)
			response.end()
		})
}
