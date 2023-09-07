export class ErrorCannotDivideByZero extends Error {
	static errorName = "ErrorCannotDivideByZero"
	constructor() {
		super(ErrorCannotDivideByZero.message())
		this.name = ErrorCannotDivideByZero.errorName
	}
	static message() {
		return "Cannot divide by zero"
	}
}

export class ErrorCannotCoerceToDecimal extends Error {
	static errorName = "ErrorCannotCoerceToDecimal"
	readonly arg: unknown
	constructor(arg: unknown) {
		super(ErrorCannotCoerceToDecimal.message())
		this.arg = arg
		this.name = ErrorCannotCoerceToDecimal.errorName
	}
	static message() {
		return "Cannot convert to Decimal"
	}
}
