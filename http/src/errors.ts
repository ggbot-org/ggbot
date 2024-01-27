import {
	__400__BAD_REQUEST__,
	__401__UNAUTHORIZED__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__,
	__502__BAD_GATEWAY__,
	HTTPStatusCode
} from "./codes.js"

type HTTPError = {
	statusCode: HTTPStatusCode
}

// TODO prefix all errors wuth HTTP, e.g. HTTPBadRequest
export class BadRequestError extends Error implements HTTPError {
	static errorName = "BadRequest"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(__400__BAD_REQUEST__))
		this.statusCode = __400__BAD_REQUEST__
	}
}

export class UnauthorizedError extends Error {
	static errorName = "Unauthorized"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(__401__UNAUTHORIZED__))
		this.statusCode = __401__UNAUTHORIZED__
	}
}

export class NotFoundError extends Error {
	static errorName = "NotFound"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(__404__NOT_FOUND__))
		this.statusCode = __404__NOT_FOUND__
	}
}

export class InternalServerError extends Error {
	static errorName = "InternalServerError"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(__500__INTERNAL_SERVER_ERROR__))
		this.statusCode = __500__INTERNAL_SERVER_ERROR__
	}
}

export class BadGatewayError extends Error {
	static errorName = "BadGateway"
	statusCode: HTTPStatusCode
	constructor() {
		super(String(__502__BAD_GATEWAY__))
		this.statusCode = __502__BAD_GATEWAY__
	}
}
