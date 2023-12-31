import { isApiActionInput, publicApiActionTypes } from "@workspace/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import { BadGatewayError } from "@workspace/http"
import { logging } from "@workspace/logging"

import { dataProvider } from "./dataProvider.js"
import { ApiService } from "./service.js"

const apiService = new ApiService(dataProvider)
const { info } = logging("user-api")

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS(["POST"])

		if (event.httpMethod === "POST") {
			if (!event.body) return BAD_REQUEST()
			info(event.httpMethod, JSON.stringify(event.body, null, 2))

			const input: unknown = JSON.parse(event.body)
			if (!isApiActionInput(publicApiActionTypes)(input))
				return BAD_REQUEST()

			const output = await apiService[input.type](input.data)
			info(input.type, JSON.stringify(output, null, 2))
			return OK(output)
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof BadGatewayError) return BAD_REQUEST()
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
