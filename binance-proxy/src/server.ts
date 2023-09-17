import { createServer } from "node:http"

import { describeElasticIps } from "@workspace/aws"
import {
	binanceApiDomain,
	BinanceRequestHeaders,
	isBinanceApiPrivateEndoint
} from "@workspace/binance"
import { __400__BAD_REQUEST__, __404__NOT_FOUND__ } from "@workspace/http"
import { logging } from "@workspace/logging"

import {
	ErrorCannotGetInstanceId,
	ErrorCannotParseStaticIps
} from "./errors.js"
import { getInstanceId } from "./getInstanceId.js"
import { parseStaticIps } from "./parseStaticIps.js"

const { info, warn } = logging("binance-proxy")

const PORT = 3000

createServer(async (request, response) => {
	const { headers: sourceHeaders, url: sourceUrl } = request

	if (typeof sourceUrl !== "string") {
		response.writeHead(__400__BAD_REQUEST__)
		response.end()
		return
	}

	info("sourceUrl", sourceUrl)

	if (sourceUrl === "/health-check") {
		response.end("OK")
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

	const targetHeaders = new Headers({
		"User-agent": "ggbot2.com"
	})
	for (const [key, value] of Object.entries(sourceHeaders))
		if (
			BinanceRequestHeaders.isApiKeyHeader(key) &&
			typeof value === "string"
		)
			targetHeaders.append(key, value)

	const proxiedResponse = await fetch(targetUrl, {
		headers: targetHeaders,
		method: request.method
	})

	response.writeHead(proxiedResponse.status)

	if (!proxiedResponse.ok) {
		console.error(
			proxiedResponse.status,
			proxiedResponse.statusText,
			targetUrl.toString()
		)
		response.end(proxiedResponse.statusText)
		return
	}

	const data = await proxiedResponse.json()
	info(data)
	const json = JSON.stringify(data)
	response.end(json)
}).listen(PORT, async () => {
	info("Server running on port", PORT)

	try {
		const instanceId = await getInstanceId
		info("Got instanceId", instanceId)

		const staticIps = parseStaticIps()
		const elasticIps = await describeElasticIps({ PublicIps: staticIps })
		info(elasticIps)
	} catch (error) {
		if (
			error instanceof ErrorCannotGetInstanceId ||
			error instanceof ErrorCannotParseStaticIps
		) {
			warn(error.message)
		} else {
			console.error(error)
		}
	}
})
