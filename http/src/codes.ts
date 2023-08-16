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
export const __200__OK__ = 200

/**
 * The server successfully processed the request, and is not returning any
 * content.
 */
export const __204__NO_CONTENT__ = 204

// 4XX client errors
// ///////////////////////////////////////////////////////////////////

/**
 * The server cannot or will not process the request due to an apparent client
 * error (e.g., malformed request syntax)
 */
export const __400__BAD_REQUEST__ = 400

/** Authentication is required and has failed or has not yet been provided. */
export const __401__UNAUTHORIZED__ = 401

/**
 * The requested resource could not be found but may be available in the future.
 * Subsequent requests by the client are permissible.
 */
export const __404__NOT_FOUND__ = 404

/**
 * A request method is not supported for the requested resource; for example, a
 * GET request on a form that requires data to be presented via POST, or a PUT
 * request on a read-only resource.
 */
export const __405__METHOD_NOT_ALLOWED__ = 405

// 5XX server errors
// ///////////////////////////////////////////////////////////////////

/**
 * A generic error message, given when an unexpected condition was encountered
 * and no more specific message is suitable.
 */
export const __500__INTERNAL_SERVER_ERROR__ = 500

/**
 * The server was acting as a gateway or proxy and received an invalid response
 * from the upstream server.
 *
 * @see {@link https://en.wikipedia.org/wiki/HTTP_502}
 */
export const __502__BAD_GATEWAY__ = 502
