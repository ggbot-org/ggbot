import { ENV } from "@workspace/env"
import { UnauthorizedError } from "@workspace/http"
import {
	ClientSession,
	clientSessionNumDays,
	isClientSession
} from "@workspace/models"
// @ts-expect-error jsonwebtoken is broken
import jsonwebtoken from "jsonwebtoken"
import { isMaybeObject } from "minimal-type-guard-helpers"

import { verifyAuthenticationHeader } from "./header.js"

export const signSession = (session: ClientSession) =>
	jsonwebtoken.sign({ data: session }, ENV.JWT_SECRET(), {
		expiresIn: `${clientSessionNumDays} days`
	})

export const readSessionFromAuthorizationHeader = (
	headerContent: unknown
): ClientSession => {
	const decoded = verifyAuthenticationHeader(headerContent)
	if (isMaybeObject<{ data: unknown }>(decoded)) {
		const { data } = decoded
		if (isClientSession(data)) return data
	}
	throw new UnauthorizedError()
}
