export class ErrorInvalidDate extends Error {
	static errorName = "ErrorInvalidDate"
	static message = "Invalid Date"
	constructor() {
		super(ErrorInvalidDate.message)
	}
}
