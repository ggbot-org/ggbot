import { IncomingMessage, ServerResponse } from "node:http"

import { isBinanceApiPrivateEndoint } from "@workspace/binance"
import {
	__400__BAD_REQUEST__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__
} from "@workspace/http"

import { binanceHandler } from "./binanceHandler.js"
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

	if (!isBinanceApiPrivateEndoint(requestUrl)) {
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

	binanceHandler(requestUrl)
		.then(({ status }) => {
			response.writeHead(status)
			response.end()
		})
		.catch((error) => {
			warn(error)
			response.writeHead(__500__INTERNAL_SERVER_ERROR__)
			response.end()
		})
}
