import { ENV } from "@workspace/env"
import { UnauthorizedError } from "@workspace/http"
import {
	ClientSession,
	clientSessionNumDays,
	isClientSession
} from "@workspace/models"
import { getDay, today } from "minimal-time-helpers"

import { decrypt, encrypt } from "./crypto.js"

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
 * const { accountId, creationDay } =
 * 	await readSessionFromAuthorizationHeader(authorization)
 * ```
 */
export async function readSessionFromAuthorizationHeader(
	headerContent: unknown
): Promise<ClientSession> {
	if (typeof headerContent !== "string") throw new UnauthorizedError()
	let sessionJson = ""
	try {
		sessionJson = await decrypt(headerContent, ENV.AUTHENTICATION_SECRET())
	} catch {
		throw new UnauthorizedError()
	}
	const session: unknown = JSON.parse(sessionJson)
	if (!isClientSession(session)) throw new UnauthorizedError()
	// Check that "expiration day" i.e. `creationDay` + `clientSessionNumDays`
	// is not in the past yet.
	if (getDay(session.creationDay).plus(clientSessionNumDays).days < today()) throw new UnauthorizedError()
	return session
}
