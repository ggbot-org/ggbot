import {
	__400__BAD_REQUEST__,
	__401__UNAUTHORIZED__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__,
	__502__BAD_GATEWAY__
} from "./codes.js"

export class BadRequestError extends Error {
	static errorName = "BadRequest"
	constructor() {
		super(String(__400__BAD_REQUEST__))
	}
}

export class NotFoundError extends Error {
	static errorName = "NotFound"
	constructor() {
		super(String(__404__NOT_FOUND__))
	}
}

export class UnauthorizedError extends Error {
	static errorName = "Unauthorized"
	constructor() {
		super(String(__401__UNAUTHORIZED__))
	}
}

export class InternalServerError extends Error {
	static errorName = "InternalServerError"
	constructor() {
		super(String(__500__INTERNAL_SERVER_ERROR__))
	}
}

export class BadGatewayError extends Error {
	static errorName = "BadGateway"
	constructor() {
		super(String(__502__BAD_GATEWAY__))
	}
}
