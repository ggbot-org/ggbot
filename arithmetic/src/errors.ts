export class ErrorCannotDivideByZero extends Error {
	static message() {
		return "Cannot divide by zero"
	}
	static errorName = "ErrorCannotDivideByZero"
	constructor() {
		super(ErrorCannotDivideByZero.message())
		this.name = ErrorCannotDivideByZero.errorName
	}
}

export class ErrorCannotCoerceToDecimal extends Error {
	static message() {
		return "Cannot convert to Decimal"
	}
	static errorName = "ErrorCannotCoerceToDecimal"
	readonly arg: unknown
	constructor(arg: unknown) {
		super(ErrorCannotCoerceToDecimal.message())
		this.arg = arg
		this.name = ErrorCannotCoerceToDecimal.errorName
	}
}
