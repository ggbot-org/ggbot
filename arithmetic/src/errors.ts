export class ErrorCannotDivideByZero extends TypeError {
  constructor() {
    super("Cannot divide by zero");
  }
}

export class ErrorCannotCoerceToDecimal extends TypeError {
  constructor(arg: unknown) {
    super(`Cannot convert to Decimal ${arg}`);
  }
}
