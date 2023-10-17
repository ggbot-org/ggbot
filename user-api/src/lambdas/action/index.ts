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
import {
	ErrorUnauthorizedAuthenticationHeader,
	readSessionFromAuthorizationHeader
} from "@workspace/authentication"
import { ErrorBinanceHTTP } from "@workspace/binance"
import { logging } from "@workspace/logging"
import {
	ErrorAccountItemNotFound,
	ErrorExceededQuota,
	ErrorUnimplementedStrategyKind
} from "@workspace/models"

import { dataProvider } from "./dataProvider.js"
import { ApiService } from "./service.js"

const { info } = logging("user-api")

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
		if (error instanceof ErrorUnauthorizedAuthenticationHeader)
			return UNATHORIZED
		if (
			error instanceof ErrorAccountItemNotFound ||
			error instanceof ErrorBinanceHTTP ||
			error instanceof ErrorExceededQuota ||
			error instanceof ErrorUnimplementedStrategyKind
		)
			return BAD_REQUEST(error.toValue())
		// Fallback to print error if not handled.
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
