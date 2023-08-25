export class ErrorInvalidData extends Error {
	static errorName = "ErrorInvalidData"
	constructor() {
		super(ErrorInvalidData.message())
	}
	static message() {
		return "Invalid data"
	}
}
