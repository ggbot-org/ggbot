import { ENV } from "@workspace/env"
import { UnauthorizedError } from "@workspace/http"
// @ts-expect-error jsonwebtoken is broken
import jsonwebtoken from "jsonwebtoken"

export const verifyAuthenticationHeader = (headerContent: unknown) => {
	if (typeof headerContent !== "string") throw new UnauthorizedError()

	const token = headerContent.substring("BEARER ".length)
	if (token.length === 0) throw new UnauthorizedError()

	try {
		const decoded = jsonwebtoken.verify(token, ENV.JWT_SECRET())
		return decoded
	} catch (_ignore) {
		throw new UnauthorizedError()
	}
}
