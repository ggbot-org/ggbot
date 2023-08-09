export class ErrorInvalidData extends Error {
  static errorName = "ErrorInvalidData";
  static message() {
    return "Invalid data";
  }
  constructor() {
    super(ErrorInvalidData.message());
  }
}
