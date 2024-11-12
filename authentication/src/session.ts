import { ENV } from '@workspace/env'
import { ClientSession, clientSessionNumDays, isClientSession } from '@workspace/models'
import { getDay, today } from 'minimal-time-helpers'

import { decrypt, encrypt } from './crypto.js'

export async function signSession(session: ClientSession) {
	return encrypt(JSON.stringify(session), ENV.AUTHENTICATION_SECRET())
}

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
export async function readSessionFromAuthorizationHeader(headerContent: unknown): Promise<ClientSession | null> {
	if (typeof headerContent !== 'string') return null
	let sessionJson = ''
	try {
		sessionJson = await decrypt(headerContent, ENV.AUTHENTICATION_SECRET())
	} catch {
		return null
	}
	const session: unknown = JSON.parse(sessionJson)
	if (!isClientSession(session)) return null
	// Check that "expiration day" i.e. `creationDay` + `clientSessionNumDays` is not in the past yet.
	if (getDay(session.creationDay).plus(clientSessionNumDays).days < today()) return null
	return session
}
