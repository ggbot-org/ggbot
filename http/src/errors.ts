import {
  __500__INTERNAL_SERVER_ERROR__,
  __502__BAD_GATEWAY__,
} from "./codes.js";

/**
 * @example
 *
 * ```ts
 * const response = await fetch(url);
 * if (!response.ok) throw new ErrorHTTP(response);
 * ```
 */
export class ErrorHTTP extends Error {
  static errorName = "ErrorHTTP";
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
  static errorName = "InternalServerError";
  constructor() {
    super(String(__500__INTERNAL_SERVER_ERROR__));
  }
}

export class BadGatewayError extends Error {
  constructor() {
    super(String(__502__BAD_GATEWAY__));
  }
}
