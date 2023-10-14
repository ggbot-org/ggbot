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
import { listAccountKeys, readAccount } from "@workspace/database"
import { logging } from "@workspace/logging"
import { isReadAccountInput } from "@workspace/models"

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

			if (action.type === "ReadAccount") {
				if (!isReadAccountInput(actionData)) return BAD_REQUEST()
				const output = await readAccount(actionData)
				info(action.type, JSON.stringify(output, null, 2))
				return OK(output)
			}

			if (action.type === "ListAccountKeys") {
				const output = await listAccountKeys()
				info(action.type, JSON.stringify(output, null, 2))
				return OK(output)
			}

			return BAD_REQUEST()
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof ErrorUnauthorizedAuthenticationHeader)
			return UNATHORIZED
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
