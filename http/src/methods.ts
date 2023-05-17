/**
 * HTTP methods.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods}
 */

export const httpMethods = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "CONNECT",
  "OPTIONS",
  "TRACE",
  "PATCH",
] as const;
export type HTTP_METHOD = (typeof httpMethods)[number];
