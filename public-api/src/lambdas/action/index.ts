import {
	ALLOWED_METHODS,
	apiActionMethod,
	APIGatewayProxyHandler,
	errorResponse,
	isActionInput,
	OK,
	publicActions
} from "@workspace/api"
import {
	BAD_REQUEST__400,
	BadGatewayError,
	INTERNAL_SERVER_ERROR__500,
	METHOD_NOT_ALLOWED__405
} from "@workspace/http"
import { logging } from "@workspace/logging"
import { documentProvider } from "@workspace/s3-data-bucket"

import { Service } from "./service.js"

const { debug, info } = logging("public-api")

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		info(event)

		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod !== apiActionMethod) {
			debug("Method not allowed")
			return errorResponse(METHOD_NOT_ALLOWED__405)
		}

		info(event.httpMethod, event.body)
		if (!event.body) {
			debug("Missing body")
			return errorResponse(BAD_REQUEST__400)
		}

		const input: unknown = JSON.parse(event.body)
		if (!isActionInput(publicActions)(input)) {
			debug("Unknown input")
			return errorResponse(BAD_REQUEST__400)
		}

		const service = new Service(documentProvider)
		const output = await service[input.type](input.data)
		info(input.type, JSON.stringify(output, null, 2))
		return OK(output)
	} catch (error) {
		for (const ErrorClass of [BadGatewayError]) if (error instanceof ErrorClass) {
			debug(error)
			return errorResponse(ErrorClass.statusCode)
		}

		// Fallback to print error if not handled.
		debug(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
