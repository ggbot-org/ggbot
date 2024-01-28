import {
	apiActionMethod,
	isActionInput,
	isUserActionInput
} from "@workspace/api"
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
import { ErrorBinanceHTTP } from "@workspace/binance"
import { UnauthorizedError } from "@workspace/http"
import {
	ErrorAccountItemNotFound,
	ErrorExceededQuota,
	ErrorUnknownItem
} from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"

import { info, warn } from "./logging.js"
import { Service } from "./service.js"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS")
			return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod === apiActionMethod) {
			info(event.httpMethod, JSON.stringify(event.body, null, 2))
			if (!event.body) return BAD_REQUEST()

			const authorization = event.headers.Authorization
			const { accountId } =
				await readSessionFromAuthorizationHeader(authorization)
			const service = new Service({
				accountKey: { accountId },
				// If `readSessionFromAuthorizationHeader` succedes, then `authorization` is a string
				authorization: authorization as string,
				documentProvider
			})

			const input: unknown = JSON.parse(event.body)
			if (!isActionInput(isUserActionInput)(input)) return BAD_REQUEST()

			const output = await service[input.type](input.data)
			info(input.type, JSON.stringify(output, null, 2))
			return OK(output)
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof UnauthorizedError) return UNATHORIZED
		if (
			error instanceof ErrorAccountItemNotFound ||
			error instanceof ErrorBinanceHTTP ||
			error instanceof ErrorExceededQuota ||
			error instanceof ErrorUnknownItem
		)
			return BAD_REQUEST(error.toJSON())
		// Fallback to print error if not handled.
		warn(error)
	}
	return INTERNAL_SERVER_ERROR
}
