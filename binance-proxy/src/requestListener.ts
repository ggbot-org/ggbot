import { IncomingMessage, ServerResponse } from "node:http"

import {
	binanceApiDomain,
	BinanceRequestHeaders,
	isBinanceApiPrivateEndoint
} from "@workspace/binance"
import { ENV } from "@workspace/env"
import { __400__BAD_REQUEST__, __404__NOT_FOUND__ } from "@workspace/http"

import { getElasticIp } from "./elasticIp.js"
import { info, warn } from "./logging.js"

const DNS_DOMAIN = ENV.DNS_DOMAIN()

const targetHeaders = new Headers({
	"User-agent": DNS_DOMAIN
})

export const requestListener = (
	request: IncomingMessage,
	response: ServerResponse
) => {
	const { headers: sourceHeaders, url: sourceUrl } = request

	if (typeof sourceUrl !== "string") {
		response.writeHead(__400__BAD_REQUEST__)
		response.end()
		return
	}

	info("sourceUrl", sourceUrl)

	if (sourceUrl === "/health-check") {
		response.end(`Elastic IP: ${getElasticIp() ?? "none"}`)
		return
	}

	if (sourceUrl === "/robots.txt") {
		response.end("User-agent: *\nDisallow: /")
		return
	}

	const targetUrl = new URL(sourceUrl, `https://${binanceApiDomain}`)

	if (!isBinanceApiPrivateEndoint(targetUrl.pathname)) {
		info(__400__BAD_REQUEST__, targetUrl.pathname)
		response.writeHead(__404__NOT_FOUND__)
		response.end()
		return
	}

	for (const [key, value] of Object.entries(sourceHeaders))
		if (
			BinanceRequestHeaders.isApiKeyHeader(key) &&
			typeof value === "string"
		)
			targetHeaders.append(key, value)

	fetch(targetUrl, {
		headers: targetHeaders,
		method: request.method
	})
		.then((proxiedResponse) => {
			response.writeHead(proxiedResponse.status)

			if (proxiedResponse.ok) return proxiedResponse.json()

			warn(
				proxiedResponse.status,
				proxiedResponse.statusText,
				// Avoid printing query string, it may contain signature.
				targetUrl.origin,
				targetUrl.pathname
			)
			response.end(proxiedResponse.statusText)
		})
		.then((data) => {
			info(data)
			response.end(JSON.stringify(data))
		})
		.catch((error) => {
			warn(error)
			response.end()
		})
}
