import { adminActions, apiActionMethod, isActionInput } from "@workspace/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK,
	UNATHORIZED
} from "@workspace/api-gateway"
import { readSessionFromAuthorizationHeader } from "@workspace/authentication"
import { BadGatewayError, UnauthorizedError } from "@workspace/http"
import { logging } from "@workspace/logging"
import { documentProvider } from "@workspace/s3-data-bucket"

import { Service } from "./service.js"

const { info, warn } = logging("admin-api")

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS")
			return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod === apiActionMethod) {
			await readSessionFromAuthorizationHeader(
				event.headers.Authorization
			)

			if (!event.body) return BAD_REQUEST()
			info(event.httpMethod, JSON.stringify(event.body, null, 2))

			const input: unknown = JSON.parse(event.body)
			if (!isActionInput(adminActions)(input)) return BAD_REQUEST()

			const service = new Service(documentProvider)
			const output = await service[input.type](input.data)
			info(input.type, JSON.stringify(output, null, 2))
			return OK(output)
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof BadGatewayError) return BAD_REQUEST()
		if (error instanceof UnauthorizedError) return UNATHORIZED
		// Fallback to print error if not handled.
		warn(error)
	}
	return INTERNAL_SERVER_ERROR
}
