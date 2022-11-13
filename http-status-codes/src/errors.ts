export class ErrorHttpResponse extends Error {
  status: number;
  statusText: string;
  constructor(status: number, statusText: string) {
    super(`${status} ${statusText}`);
    this.name = ErrorHttpResponse.name;
    this.status = status;
    this.statusText = statusText;
  }
}

export class InternalServerError extends Error {
  constructor() {
    super("500");
    this.name = InternalServerError.name;
  }
}
