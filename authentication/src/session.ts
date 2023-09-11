import { ENV } from "@workspace/env"
import {
	ClientSession,
	clientSessionNumDays,
	isClientSession
} from "@workspace/models"
import { isMaybeObject } from "@workspace/type-utils"
// @ts-ignore
import jsonwebtoken from "jsonwebtoken"

import { ErrorUnauthorizedAuthenticationHeader } from "./errors.js"
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
	throw new ErrorUnauthorizedAuthenticationHeader()
}
