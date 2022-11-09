export class ErrorInvalidDate extends TypeError {
  constructor(arg: unknown) {
    super(`Invalid Date ${arg}`);
  }
}

export class ErrorInvalidTimestamp extends TypeError {
  constructor(arg: unknown) {
    super(`Invalid Timestamp ${arg}`);
  }
}
