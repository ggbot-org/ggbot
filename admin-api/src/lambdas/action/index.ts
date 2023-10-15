import { isAdminApiActionRequestData as isApiActionRequestData } from "@workspace/api"
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
import { BadGatewayError } from "@workspace/http"
import { logging } from "@workspace/logging"

import { dataProvider } from "./dataProvider.js"
import { ApiService } from "./service.js"

const apiService = new ApiService(dataProvider)
const { info } = logging("admin-api")

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS(["POST"])

		if (event.httpMethod === "POST") {
			info(event.httpMethod, JSON.stringify(event.body, null, 2))
			if (!event.body) return BAD_REQUEST()

			readSessionFromAuthorizationHeader(event.headers.Authorization)

			const action = JSON.parse(event.body)

			if (!isApiActionRequestData(action)) return BAD_REQUEST()
			const actionData = action.data

			const output = await apiService[action.type](actionData)
			info(action.type, JSON.stringify(output, null, 2))
			return OK(output)
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof BadGatewayError) return BAD_REQUEST()
		if (error instanceof ErrorUnauthorizedAuthenticationHeader)
			return UNATHORIZED
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
