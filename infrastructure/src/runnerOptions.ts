/**
 * An "Active Test" pushes modifications to the infrastructures.
 *
 * @remarks
 * It run only if `ACTIVE_TEST` environment variable is found.
 */
export const ACTIVE_TEST = { skip: !process.env.ACTIVE_TEST }
