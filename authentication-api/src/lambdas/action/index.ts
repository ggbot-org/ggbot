import { ALLOWED_METHODS, apiActionMethod, APIGatewayProxyHandler, authClientActions, errorResponse, isActionInput, OK } from "@workspace/api"
import { BAD_REQUEST__400, BadGatewayError, INTERNAL_SERVER_ERROR__500, METHOD_NOT_ALLOWED__405 } from "@workspace/http"
import { logging } from "@workspace/logging"
import { documentProvider } from "@workspace/s3-data-bucket"

import { Service } from "./service.js"

const { info } = logging("auth-api")

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		info(event)

		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod !== apiActionMethod) return errorResponse(METHOD_NOT_ALLOWED__405)

		if (!event.body) return errorResponse(BAD_REQUEST__400)
		info(event.httpMethod, JSON.stringify(event.body, null, 2))

		const input: unknown = JSON.parse(event.body)
		if (!isActionInput(authClientActions)(input)) return errorResponse(BAD_REQUEST__400)

		const service = new Service(documentProvider)
		const output = await service[input.type](input.data)
		info(input.type, JSON.stringify(output, null, 2))
		return OK(output)
	} catch (error) {
		if (error instanceof BadGatewayError) return errorResponse(BAD_REQUEST__400)

		// Fallback if error is not handled: should not arrive here.
		console.debug(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
