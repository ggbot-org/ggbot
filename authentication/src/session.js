import { ENV } from '@workspace/env'
import { getDay, today } from 'minimal-time-helpers'

import { decrypt, encrypt } from './crypto.js'

const clientSessionNumDays = 30

const AUTHENTICATION_SECRET = ENV.AUTHENTICATION_SECRET()

export async function signSession(session) {
	return encrypt(JSON.stringify(session), AUTHENTICATION_SECRET)
}

export async function readSessionFromAuthorizationHeader(headerContent) {
	if (typeof headerContent !== 'string') return null
	let sessionJson = ''
	try {
		sessionJson = await decrypt(headerContent, AUTHENTICATION_SECRET)
	    const session = JSON.parse(sessionJson)
		// Check that "expiration day" i.e. `creationDay` + `clientSessionNumDays` is not in the past yet.
		if (getDay(session.creationDay).plus(clientSessionNumDays).days < today()) return null
		return session
	} catch(error) {
		console.error(error)
		return null
	}
}
