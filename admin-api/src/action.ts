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
import { isReadAccountInput } from "@workspace/models"

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
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
						return OK(output)
					}

					case "ListAccountKeys": {
						const output = await listAccountKeys()
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
