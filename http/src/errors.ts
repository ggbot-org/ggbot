import {
	BAD_GATEWAY__502,
	BAD_REQUEST__400,
	HTTPStatusCode,
	INTERNAL_SERVER_ERROR__500,
	NOT_FOUND__404,
	UNAUTHORIZED__401
} from "./codes.js"

type HTTPError = {
	statusCode: HTTPStatusCode
}

// TODO prefix all errors wuth HTTP, e.g. HTTPBadRequest
export class BadRequestError extends Error implements HTTPError {
	static errorName = "BadRequest"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(BAD_REQUEST__400))
		this.statusCode = BAD_REQUEST__400
	}
}

export class UnauthorizedError extends Error {
	static errorName = "Unauthorized"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(UNAUTHORIZED__401))
		this.statusCode = UNAUTHORIZED__401
	}
}

export class NotFoundError extends Error {
	static errorName = "NotFound"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(NOT_FOUND__404))
		this.statusCode = NOT_FOUND__404
	}
}

export class InternalServerError extends Error {
	static errorName = "InternalServerError"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(INTERNAL_SERVER_ERROR__500))
		this.statusCode = INTERNAL_SERVER_ERROR__500
	}
}

export class BadGatewayError extends Error {
	static errorName = "BadGateway"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(BAD_GATEWAY__502))
		this.statusCode = BAD_GATEWAY__502
	}
}
