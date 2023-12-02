import { isApiActionInput, userApiActionTypes } from "@workspace/api"
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
	ErrorUnimplementedStrategyKind
} from "@workspace/models"

import { dataProvider } from "./dataProvider.js"
import { info, warn } from "./logging.js"
import { ApiService } from "./service.js"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS(["POST"])

		if (event.httpMethod === "POST") {
			info(event.httpMethod, JSON.stringify(event.body, null, 2))

			if (!event.body) return BAD_REQUEST()
			info(event.httpMethod, JSON.stringify(event.body, null, 2))

			const { accountId } = readSessionFromAuthorizationHeader(
				event.headers.Authorization
			)

			const apiService = new ApiService({ accountId }, dataProvider)

			const input: unknown = JSON.parse(event.body)
			if (!isApiActionInput(userApiActionTypes)(input))
				return BAD_REQUEST()

			const output = await apiService[input.type](input.data)
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
			error instanceof ErrorUnimplementedStrategyKind
		)
			return BAD_REQUEST(error.toValue())
		// Fallback to print error if not handled.
		if (error instanceof Error) warn(error.message)
		else warn(error)
	}
	return INTERNAL_SERVER_ERROR
}
