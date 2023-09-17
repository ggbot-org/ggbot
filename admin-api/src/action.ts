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

const { info } = logging("user-api")

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				info(event.httpMethod, JSON.stringify(event.body, null, 2))
				if (!event.body) return BAD_REQUEST()

				readSessionFromAuthorizationHeader(event.headers.Authorization)

				const action = JSON.parse(event.body)

				if (!isApiActionRequestData(action)) return BAD_REQUEST()
				const actionData = action.data

				switch (action.type) {
					case "ReadAccount": {
						if (!isReadAccountInput(actionData))
							return BAD_REQUEST()
						const output = await readAccount(actionData)
						info(action.type, JSON.stringify(output, null, 2))
						return OK(output)
					}

					case "ListAccountKeys": {
						const output = await listAccountKeys()
						info(action.type, JSON.stringify(output, null, 2))
						return OK(output)
					}

					default:
						return BAD_REQUEST()
				}
			}

			default:
				return METHOD_NOT_ALLOWED
		}
	} catch (error) {
		if (error instanceof ErrorUnauthorizedAuthenticationHeader)
			return UNATHORIZED
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
