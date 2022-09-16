export class ErrorCannotDivideByZero extends TypeError {
  constructor() {
    super("Cannot divide by zero");
  }
}

export class ErrorInvalidDecimal extends TypeError {
  constructor(value: unknown) {
    super(`Invalid decimal number ${value}`);
  }
}
