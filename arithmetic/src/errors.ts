export class ErrorCannotDivideByZero extends Error {
	constructor() {
		super(ErrorCannotDivideByZero.message())
	}
	static message() {
		return "Cannot divide by zero"
	}
}

export class ErrorCannotCoerceToDecimal extends Error {
	readonly arg: unknown
	constructor(arg: unknown) {
		super(ErrorCannotCoerceToDecimal.message())
		this.arg = arg
	}
	static message() {
		return "Cannot convert to Decimal"
	}
}
