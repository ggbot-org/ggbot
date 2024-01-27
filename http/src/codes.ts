/**
 * HTTP Status codes.
 *
 * - 2XX success
 * - 4XX client errors
 * - 5XX server errors
 *
 * @see {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}
 */

// 2XX success
// ///////////////////////////////////////////////////////////////////

/** Standard response for successful HTTP requests. */
export const OK__200 = 200

// 4XX client errors
// ///////////////////////////////////////////////////////////////////

/**
 * The server cannot or will not process the request due to an apparent client
 * error (e.g., malformed request syntax)
 */
export const BAD_REQUEST__400 = 400

/** Authentication is required and has failed or has not yet been provided. */
export const UNAUTHORIZED__401 = 401

/**
 * The requested resource could not be found but may be available in the future.
 * Subsequent requests by the client are permissible.
 */
export const NOT_FOUND__404 = 404

/**
 * A request method is not supported for the requested resource; for example, a
 * GET request on a form that requires data to be presented via POST, or a PUT
 * request on a read-only resource.
 */
export const METHOD_NOT_ALLOWED__405 = 405

// 5XX server errors
// ///////////////////////////////////////////////////////////////////

/**
 * A generic error message, given when an unexpected condition was encountered
 * and no more specific message is suitable.
 */
export const INTERNAL_SERVER_ERROR__500 = 500

/**
 * The server was acting as a gateway or proxy and received an invalid response
 * from the upstream server.
 *
 * @see {@link https://en.wikipedia.org/wiki/HTTP_502}
 */
export const BAD_GATEWAY__502 = 502

export type HTTPStatusCode =
	| typeof OK__200
	| typeof BAD_REQUEST__400
	| typeof UNAUTHORIZED__401
	| typeof NOT_FOUND__404
	| typeof METHOD_NOT_ALLOWED__405
	| typeof INTERNAL_SERVER_ERROR__500
	| typeof BAD_GATEWAY__502
