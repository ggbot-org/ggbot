export class ErrorArithmeticOperationCannotDivideByZero extends TypeError {
  constructor() {
    super("Cannot divide by zero");
  }
}

export class ErrorArithmeticOperationInvalidDecimal extends TypeError {
  constructor(value: unknown) {
    super(`Invalid decimal number ${value}`);
  }
}

export class ErrorMissingDflowExecutionReport extends Error {
  constructor() {
    super("Missing Dflow executionReport");
  }
}

export class ErrorUknownDflowNodes extends Error {
  constructor(nodes: string[]) {
    super(JSON.stringify(nodes));
  }
}
