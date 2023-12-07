import { ENV } from "@workspace/env"
import { UnauthorizedError } from "@workspace/http"
import {
	ClientSession,
	clientSessionNumDays,
	isClientSession
} from "@workspace/models"
import { getDay, today } from "minimal-time-helpers"

import { decrypt, encrypt } from "./crypto.js"
import { extractAuthenticationHeaderToken } from "./header.js"

export const signSession = async (session: ClientSession) =>
	await encrypt(JSON.stringify(session), ENV.AUTHENTICATION_SECRET())

export const readSessionFromAuthorizationHeader = async (
	headerContent: unknown
): Promise<ClientSession> => {
	const token = extractAuthenticationHeaderToken(headerContent)
	const sessionJson = await decrypt(token, ENV.AUTHENTICATION_SECRET())
	const session: unknown = JSON.parse(sessionJson)
	if (!isClientSession(session)) throw new UnauthorizedError()
	// Check that "expiration day" i.e. `creationDay` + `clientSessionNumDays`
	// is not in the past yet.
	if (getDay(session.creationDay).plus(clientSessionNumDays).days < today())
		throw new UnauthorizedError()
	return session
}
