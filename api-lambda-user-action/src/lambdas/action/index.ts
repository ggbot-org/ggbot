import { ALLOWED_METHODS, apiActionMethod, APIGatewayProxyHandler, BAD_REQUEST, BAD_REQUEST__400, BadGatewayError, ERROR, errorResponse, GatewayTimeoutError, INTERNAL_SERVER_ERROR__500, isActionInput, METHOD_NOT_ALLOWED__405, OK, UNAUTHORIZED__401, UnauthorizedError, userClientActions } from "@workspace/api"
import { readSessionFromAuthorizationHeader } from "@workspace/authentication"
import { ErrorBinanceHTTP } from "@workspace/binance"
import { ErrorAccountItemNotFound, ErrorExceededQuota, ErrorUnknownItem } from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"

import { Service } from "./service.js"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod !== apiActionMethod) return errorResponse(METHOD_NOT_ALLOWED__405)

		if (!event.body) return errorResponse(BAD_REQUEST__400)

		const authorization = event.headers.Authorization
		const session = await readSessionFromAuthorizationHeader(authorization)
		if (!session) return errorResponse(UNAUTHORIZED__401)

		const { accountId } = session
		const service = new Service(
			{ accountId },
			documentProvider,
			// If `readSessionFromAuthorizationHeader` succedes, then `authorization` is a string
			authorization as string
		)

		const input: unknown = JSON.parse(event.body)
		if (!isActionInput(userClientActions)(input)) return errorResponse(BAD_REQUEST__400)

		const output = await service[input.type](input.data)
		return OK(output)
	} catch (error) {
		for (const ErrorClass of [
			BadGatewayError,
			GatewayTimeoutError,
			UnauthorizedError,
		]) if (error instanceof ErrorClass) {
			return errorResponse(ErrorClass.statusCode)
		}

		if (error instanceof ErrorExceededQuota) return ERROR(error.toJSON())

		if (
			error instanceof ErrorAccountItemNotFound ||
			error instanceof ErrorBinanceHTTP ||
			error instanceof ErrorUnknownItem
		) {
			return BAD_REQUEST(error.toJSON())
		}

		// Fallback if error is not handled: should not arrive here.
		console.error(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
