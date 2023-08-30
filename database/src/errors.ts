export class ErrorInvalidData extends Error {
	static errorName = "ErrorInvalidData"
	constructor() {
		super(ErrorInvalidData.message())
		this.name = ErrorInvalidData.errorName
	}
	static message() {
		return "Invalid data"
	}
}
