import { AccountKey, CreationDay } from '@workspace/models'

/** A `Session` starts on a day on behalf of an account. */
export type Session = AccountKey & CreationDay

export declare function signSession(session: ClientSession): Promise<string>

/**
 * Get client session from encrypted authorization header.
 *
 * @example
 *
 * ```ts
 * const authorization = event.headers.Authorization
 * const session = await readSessionFromAuthorizationHeader(authorization)
 * if (!session) console.error(401) // Unauthorized
 * ```
 */
export declare function readSessionFromAuthorizationHeader(headerContent: unknown): Promise<ClientSession | null>
