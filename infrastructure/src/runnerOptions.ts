/**
 * An "Active Test" pushes modifications to the infrastructures. It run only if
 * `ACTIVE_TEST` environment variable is found.
 */
export const ACTIVE_TEST = { skip: !process.env.ACTIVE_TEST }

/**
 * Do not run if active tests are enabled. For example checking if an item
 * exists should be skipped in this case.
 */
export const SKIP_WHEN_TESTS_ARE_ACTIVE = { skip: process.env.ACTIVE_TEST }
