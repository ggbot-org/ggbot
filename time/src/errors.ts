export class ErrorInvalidDate extends TypeError {
  constructor() {
    super("Invalid Date");
  }
}

export class ErrorInvalidTimestamp extends TypeError {
  constructor() {
    super("Invalid Timestamp");
  }
}
