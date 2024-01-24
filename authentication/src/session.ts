import {ENV} from "@workspace/env"
import {UnauthorizedError} from "@workspace/http"
import {
	ClientSession,
	clientSessionNumDays,
	isClientSession
} from "@workspace/models"
import {getDay, today} from "minimal-time-helpers"

import {decrypt, encrypt} from "./crypto.js"

export const signSession = async (session: ClientSession) =>
	await encrypt(JSON.stringify(session), ENV.AUTHENTICATION_SECRET())

export const readSessionFromAuthorizationHeader = async (
	headerContent: unknown
): Promise<ClientSession> => {
	if (typeof headerContent !== "string") throw new UnauthorizedError()
	const sessionJson = await decrypt(headerContent, ENV.AUTHENTICATION_SECRET())
	const session: unknown = JSON.parse(sessionJson)
	if (!isClientSession(session)) throw new UnauthorizedError()
	// Check that "expiration day" i.e. `creationDay` + `clientSessionNumDays`
	// is not in the past yet.
	if (getDay(session.creationDay).plus(clientSessionNumDays).days < today())
		throw new UnauthorizedError()
	return session
}
