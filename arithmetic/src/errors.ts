export class ErrorCannotDivideByZero extends Error {
  static message = "Cannot divide by zero";
  constructor() {
    super(ErrorCannotDivideByZero.message);
  }
}

export class ErrorCannotCoerceToDecimal extends Error {
  static message = "Cannot convert to Decimal";
  readonly arg: unknown;
  constructor(arg: unknown) {
    super(ErrorCannotCoerceToDecimal.message);
    this.name = ErrorCannotCoerceToDecimal.name;
    this.arg = arg;
  }
}
