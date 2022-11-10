export class ErrorInvalidDate extends TypeError {
  constructor() {
    super("Invalid Date");
    this.name = ErrorInvalidDate.name;
  }
}
