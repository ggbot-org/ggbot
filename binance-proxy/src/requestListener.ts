import { IncomingMessage, ServerResponse } from "node:http"

import {readSessionFromAuthorizationHeader} from "@workspace/authentication"
import {
	__200__OK__,
	__400__BAD_REQUEST__,
	__401__UNAUTHORIZED__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__
} from "@workspace/http"
import { BinanceProxyURLs } from "@workspace/locators"
import { ErrorAccountItemNotFound } from "@workspace/models"

import { binanceRequestHandler } from "./binanceRequestHandler.js"
import { getElasticIp } from "./elasticIp.js"
import { warn } from "./logging.js"
import {apiActionMethod} from "@workspace/api"

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
  const binanceProxy = new BinanceProxyURLs('localhost')

	if (requestUrl === binanceProxy.action.pathname) {
	if (request.method !== apiActionMethod) {
		response.writeHead(__400__BAD_REQUEST__)
		response.end()
		return
	}

			 readSessionFromAuthorizationHeader(
				request.headers.Authorization
			 ).then(({accountId}) => binanceRequestHandler(requestUrl, { accountId }))
		.then(() => {
			response.writeHead(__200__OK__)
			 }).catch(error =>{ 
			if (error instanceof ErrorAccountItemNotFound) {
				response.writeHead(__401__UNAUTHORIZED__)
				return
			}

			// Fallback to print out error an return an "Internal Server Error" code.
				 warn(error)
			response.writeHead(__500__INTERNAL_SERVER_ERROR__)
			 }).finally(() => {
			response.end()
			 })
	}

	// The request URL is not known if we arrive here.
		warn(__404__NOT_FOUND__, requestUrl)
		response.writeHead(__404__NOT_FOUND__)
		response.end()

}
