export class ErrorItemNotFound extends Error {
  constructor() {
    super("ItemNotFound");
  }
}

export class ErrorItemNotValid extends Error {
  constructor() {
    super("ItemNotValid");
  }
}
