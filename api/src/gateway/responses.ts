
import { ApiActionOutputData, ApiActionOutputError } from "../action.js"
import { BAD_REQUEST__400, OK__200 } from "../http/codes.js"
import { commonHeaders } from "./commonHeaders.js"
import { responseBody } from "./responseBody.js"
import { APIGatewayProxyResult } from "./types.js"

type HTTP_METHOD = "GET" | "POST"

export function ALLOWED_METHODS(methods: HTTP_METHOD[]) {
	return {
		body: "",
		headers: {
			"Access-Control-Allow-Headers": "Authorization,Content-type",
			"Access-Control-Allow-Methods": ["OPTIONS"].concat(methods).join(),
			...commonHeaders
		},
		isBase64Encoded: false,
		statusCode: OK__200
	}
}

export function OK(data: ApiActionOutputData["data"]): APIGatewayProxyResult {
	return {
		...responseBody({ data }),
		headers: {
			"Content-Type": "application/json",
			...commonHeaders
		},
		isBase64Encoded: false,
		statusCode: OK__200
	}
}

export function ERROR(
	error: ApiActionOutputError["error"]
): APIGatewayProxyResult {
	return {
		...responseBody({ error }),
		headers: {
			"Content-Type": "application/json",
			...commonHeaders
		},
		isBase64Encoded: false,
		statusCode: OK__200
	}
}

export function BAD_REQUEST(
	error?: ApiActionOutputError["error"]
): APIGatewayProxyResult {
	return {
		...(error ? responseBody({ error }) : { body: "" }),
		headers: commonHeaders,
		isBase64Encoded: false,
		statusCode: BAD_REQUEST__400
	}
}
