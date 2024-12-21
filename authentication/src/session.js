import { ENV } from '@workspace/env'
import { getDay, today } from 'minimal-time-helpers'

import { decrypt, encrypt } from './crypto.js'

/** @typedef {import('./session').Session} Session */

const sessionNumDays = 30

const AUTHENTICATION_SECRET = ENV.AUTHENTICATION_SECRET()

/** @type {import('./session').signSession} */
export async function signSession(session) {
	return encrypt(JSON.stringify(session), AUTHENTICATION_SECRET)
}

/** @type {import('./session').readSessionFromAuthorizationHeader} */
export async function readSessionFromAuthorizationHeader(header) {
	if (typeof header !== 'string') return null
	try {
		const sessionJson = await decrypt(header, AUTHENTICATION_SECRET)
	    const session = JSON.parse(sessionJson)
		// Check that "expiration day" i.e. `creationDay` + `sessionNumDays` is not in the past yet.
		if (getDay(session.creationDay).plus(sessionNumDays).days < today()) return null
		return session
	} catch(error) {
		console.error(error)
		return null
	}
}
