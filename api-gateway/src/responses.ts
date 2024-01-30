import { ApiActionOutputData, ApiActionOutputError } from "@workspace/api"
import { BAD_REQUEST__400, HTTP_METHOD, OK__200 } from "@workspace/http"

import { commonHeaders } from "./commonHeaders.js"
import { responseBody } from "./responseBody.js"
import { APIGatewayProxyResult } from "./types.js"

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

export const BAD_REQUEST = (
	error?: ApiActionOutputError["error"]
): APIGatewayProxyResult => ({
	...(error ? responseBody({ error }) : { body: "" }),
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode: BAD_REQUEST__400
})
