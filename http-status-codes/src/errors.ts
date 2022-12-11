/**
 *
 * @example
 * ```ts
 * const response = await fetch(url);
 * if (!response.ok) throw new ErrorHTTP(response);
 * ```
 */
export class ErrorHTTP extends Error {
  static message(status: ErrorHTTP["status"]) {
    return `Server responded with ${status}`;
  }
  status: number;
  statusText: string;
  constructor({
    status,
    statusText,
  }: Pick<ErrorHTTP, "status" | "statusText">) {
    super(ErrorHTTP.message(status));
    this.status = status;
    this.statusText = statusText;
  }
}

export class InternalServerError extends Error {
  constructor() {
    super("500");
  }
}
