import { ApiActionOutputData, ApiActionOutputError } from "@workspace/api"
import { ENV } from "@workspace/env"
import {
	__200__OK__,
	__400__BAD_REQUEST__,
	__401__UNAUTHORIZED__,
	__405__METHOD_NOT_ALLOWED__,
	__500__INTERNAL_SERVER_ERROR__,
	HTTP_METHOD
} from "@workspace/http"
import { FQDN, WebappBaseURL } from "@workspace/locators"

import { responseBody } from "./responseBody.js"
import { APIGatewayProxyResult } from "./types.js"

const fqdn = new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())

const commonHeaders = {
	"Access-Control-Allow-Credentials": "true",
	"Access-Control-Allow-Origin": new WebappBaseURL(fqdn).origin
}

export const ALLOWED_METHODS = (methods: HTTP_METHOD[]) => ({
	body: "",
	headers: {
		"Access-Control-Allow-Headers": "Authorization,Content-type",
		"Access-Control-Allow-Methods": ["OPTIONS"].concat(methods).join(),
		...commonHeaders
	},
	isBase64Encoded: false,
	statusCode: __200__OK__
})

export const BAD_REQUEST = (
	error?: ApiActionOutputError["error"]
): APIGatewayProxyResult => ({
	...(error ? responseBody({ error }) : { body: "" }),
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: __400__BAD_REQUEST__
})

export const INTERNAL_SERVER_ERROR: APIGatewayProxyResult = {
	body: "",
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: __500__INTERNAL_SERVER_ERROR__
}

export const METHOD_NOT_ALLOWED = {
	body: "",
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: __405__METHOD_NOT_ALLOWED__
}

export const OK = (
	data: ApiActionOutputData["data"]
): APIGatewayProxyResult => ({
	...responseBody({ data }),
	headers: {
		"Content-Type": "application/json",
		...commonHeaders
	},
	isBase64Encoded: false,
	statusCode: __200__OK__
})

export const UNATHORIZED: APIGatewayProxyResult = {
	body: "",
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: __401__UNAUTHORIZED__
}
