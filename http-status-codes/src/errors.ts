export class ErrorHttpResponse extends Error {
  status: number;
  statusText: string;
  constructor({
    status,
    statusText,
  }: Pick<ErrorHttpResponse, "status" | "statusText">) {
    super("HTTP Response failure");
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
