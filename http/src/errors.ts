import { BAD_GATEWAY__502, BAD_REQUEST__400, GATEWAY_TIMEOUT__504, HTTPStatusCode, INTERNAL_SERVER_ERROR__500, NOT_FOUND__404, UNAUTHORIZED__401 } from "./codes.js"

type HTTPError = {
	statusCode: HTTPStatusCode
}

export class BadRequestError extends Error implements HTTPError {
	static errorName = "BadRequest"
	static statusCode: HTTPStatusCode = BAD_REQUEST__400
	statusCode: HTTPStatusCode = BAD_REQUEST__400
	constructor() {
		super(String(BAD_REQUEST__400))
	}
}

export class UnauthorizedError extends Error implements HTTPError {
	static errorName = "Unauthorized"
	static statusCode: HTTPStatusCode = UNAUTHORIZED__401
	statusCode: HTTPStatusCode = UNAUTHORIZED__401
	constructor() {
		super(String(UNAUTHORIZED__401))
	}
}

export class NotFoundError extends Error implements HTTPError {
	static errorName = "NotFound"
	static statusCode: HTTPStatusCode = NOT_FOUND__404
	statusCode: HTTPStatusCode = NOT_FOUND__404
	constructor() {
		super(String(NOT_FOUND__404))
	}
}

export class InternalServerError extends Error implements HTTPError {
	static errorName = "InternalServerError"
	static statusCode: HTTPStatusCode = INTERNAL_SERVER_ERROR__500
	statusCode: HTTPStatusCode = INTERNAL_SERVER_ERROR__500
	constructor() {
		super(String(INTERNAL_SERVER_ERROR__500))
	}
}

export class BadGatewayError extends Error implements HTTPError {
	static errorName = "BadGateway"
	static statusCode: HTTPStatusCode = BAD_GATEWAY__502
	statusCode: HTTPStatusCode = BAD_GATEWAY__502
	constructor() {
		super(String(BAD_GATEWAY__502))
	}
}

export class GatewayTimeoutError extends Error implements HTTPError {
	static errorName = "BadGateway"
	static statusCode: HTTPStatusCode = GATEWAY_TIMEOUT__504
	statusCode: HTTPStatusCode = GATEWAY_TIMEOUT__504
	constructor() {
		super(String(GATEWAY_TIMEOUT__504))
	}
}
