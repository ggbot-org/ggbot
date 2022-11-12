export class ErrorCannotDivideByZero extends TypeError {
  constructor() {
    super("Cannot divide by zero");
    this.name = ErrorCannotDivideByZero.name;
  }
}

export class ErrorCannotCoerceToDecimal extends TypeError {
  constructor(arg: unknown) {
    super(`Cannot convert to Decimal ${arg}`);
    this.name = ErrorCannotCoerceToDecimal.name;
  }
}
