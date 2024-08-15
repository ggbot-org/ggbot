import { ALLOWED_METHODS, apiActionMethod, APIGatewayProxyHandler, errorResponse, isActionInput, OK, stripeClientActions } from "@workspace/api"
import { readSessionFromAuthorizationHeader } from "@workspace/authentication"
import { BAD_REQUEST__400, BadGatewayError, GatewayTimeoutError, INTERNAL_SERVER_ERROR__500, METHOD_NOT_ALLOWED__405, UnauthorizedError } from "@workspace/http"
import { logging } from "@workspace/logging"

import { Service } from "./service.js"

const { info } = logging("stripe-api")

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		info(event)

		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod !== apiActionMethod) return errorResponse(METHOD_NOT_ALLOWED__405)

		info(event.httpMethod, event.body)
		if (!event.body) return errorResponse(BAD_REQUEST__400)

		const authorization = event.headers.Authorization
		const accountKey = await readSessionFromAuthorizationHeader(authorization)
		const service = new Service(accountKey)

		const input: unknown = JSON.parse(event.body)
		if (!isActionInput(stripeClientActions)(input)) return errorResponse(BAD_REQUEST__400)

		const output = await service[input.type](input.data)
		info(input.type, JSON.stringify(output, null, 2))
		return OK(output)
	} catch (error) {
		for (const ErrorClass of [
			BadGatewayError,
			GatewayTimeoutError,
			UnauthorizedError
		]) if (error instanceof ErrorClass) {
			return errorResponse(ErrorClass.statusCode)
		}
		// Fallback if error is not handled: should not arrive here.
		console.debug(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
