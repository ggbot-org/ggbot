export class TimeoutError extends Error {
	static errorName = 'TimeoutError'
	constructor() {
		super(TimeoutError.message())
	}
	static message() {
		return 'Timeout'
	}
}

export class GenericError extends Error {
	static errorName = 'GenericError'
	constructor() {
		super(GenericError.message())
	}
	static message() {
		return 'Generic error'
	}
}
