import { adminClientActions, ALLOWED_METHODS, apiActionMethod, APIGatewayProxyHandler, errorResponse, isActionInput, OK } from "@workspace/api"
import { readSessionFromAuthorizationHeader } from "@workspace/authentication"
import { BAD_REQUEST__400, BadGatewayError, INTERNAL_SERVER_ERROR__500, METHOD_NOT_ALLOWED__405, UnauthorizedError } from "@workspace/http"
import { logging } from "@workspace/logging"
import { documentProvider } from "@workspace/s3-data-bucket"

import { Service } from "./service.js"

const { info } = logging("admin-api")

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		info(event)

		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod !== apiActionMethod) return errorResponse(METHOD_NOT_ALLOWED__405)

		await readSessionFromAuthorizationHeader(event.headers.Authorization)

		info(event.httpMethod, event.body)
		if (!event.body) return errorResponse(BAD_REQUEST__400)

		const input: unknown = JSON.parse(event.body)
		if (!isActionInput(adminClientActions)(input)) return errorResponse(BAD_REQUEST__400)

		const service = new Service(documentProvider)
		const output = await service[input.type](input.data)
		info(input.type, JSON.stringify(output, null, 2))
		return OK(output)
	} catch (error) {
		for (const ErrorClass of [
			BadGatewayError,
			UnauthorizedError,
		]) if (error instanceof ErrorClass) {
			return errorResponse(ErrorClass.statusCode)
		}
		// Fallback if error is not handled: should not arrive here.
		console.debug(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
