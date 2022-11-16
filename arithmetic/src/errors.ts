export class ErrorCannotDivideByZero extends Error {
  constructor() {
    super("Cannot divide by zero");
    this.name = ErrorCannotDivideByZero.name;
  }
}

export class ErrorCannotCoerceToDecimal extends Error {
  readonly arg: unknown;
  constructor(arg: unknown) {
    super("Cannot convert to Decimal");
    this.name = ErrorCannotCoerceToDecimal.name;
    this.arg = arg;
  }
}
