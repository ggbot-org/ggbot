// See also https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

// 2XX success
// ///////////////////////////////////////////////////////////////////

// Standard response for successful HTTP requests.
export const __200__OK__ = 200;

// 4XX client errors
// ///////////////////////////////////////////////////////////////////

// The server cannot or will not process the request due to an apparent client error
// (e.g., malformed request syntax)
export const __400__BAD_REQUEST__ = 400;

// Authentication is required and has failed or has not yet been provided.
export const __401__UNAUTHORIZED__ = 401;

// A request method is not supported for the requested resource;
// for example, a GET request on a form that requires data to be presented via POST,
// or a PUT request on a read-only resource.
export const __405__METHOD_NOT_ALLOWED__ = 405;

// 5XX server errors
// ///////////////////////////////////////////////////////////////////

// A generic error message, given when an unexpected condition was encountered
// and no more specific message is suitable.
export const __500__INTERNAL_SERVER_ERROR__ = 500;
