import { UnauthorizedError } from "@workspace/http"

export const extractAuthenticationHeaderToken = (
	headerContent: unknown
): string => {
	if (typeof headerContent !== "string") throw new UnauthorizedError()

	const token = headerContent.substring("BEARER ".length)
	if (token.length === 0) throw new UnauthorizedError()

	return token
}
