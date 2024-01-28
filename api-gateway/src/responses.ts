import { ApiActionOutputData, ApiActionOutputError } from "@workspace/api"
import { ENV } from "@workspace/env"
import {
	BAD_REQUEST__400,
	HTTP_METHOD,
	INTERNAL_SERVER_ERROR__500,
	METHOD_NOT_ALLOWED__405,
	OK__200,
	UNAUTHORIZED__401
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
	statusCode: OK__200
})

export const BAD_REQUEST = (
	error?: ApiActionOutputError["error"]
): APIGatewayProxyResult => ({
	...(error ? responseBody({ error }) : { body: "" }),
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: BAD_REQUEST__400
})

export const INTERNAL_SERVER_ERROR: APIGatewayProxyResult = {
	body: "",
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: INTERNAL_SERVER_ERROR__500
}

export const METHOD_NOT_ALLOWED = {
	body: "",
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: METHOD_NOT_ALLOWED__405
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
	statusCode: OK__200
})

export const UNATHORIZED: APIGatewayProxyResult = {
	body: "",
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: UNAUTHORIZED__401
}
