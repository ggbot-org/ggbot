export class ErrorInvalidDate extends Error {
  static message = "Invalid Date";
  constructor() {
    super(ErrorInvalidDate.message);
  }
}
