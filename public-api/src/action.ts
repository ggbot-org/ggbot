import { isPublicApiActionRequestData as isApiActionRequestData } from "@workspace/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import { readStrategy, readStrategyFlow } from "@workspace/database"
import { isDev } from "@workspace/env"
import { logging } from "@workspace/logging"
import { isReadStrategyFlowInput, isReadStrategyInput } from "@workspace/models"

const { info } = logging("user-api", isDev)

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				info(event.httpMethod, JSON.stringify(event.body, null, 2))
				if (!event.body) return BAD_REQUEST()

				const action = JSON.parse(event.body)

				if (!isApiActionRequestData(action)) return BAD_REQUEST()
				const actionData = action.data

				switch (action.type) {
					case "ReadStrategy": {
						if (!isReadStrategyInput(actionData))
							return BAD_REQUEST()
						const output = await readStrategy(actionData)
						info(action.type, JSON.stringify(output, null, 2))
						return OK(output)
					}

					case "ReadStrategyFlow": {
						if (!isReadStrategyFlowInput(actionData))
							return BAD_REQUEST()
						const output = await readStrategyFlow(actionData)
						// Omit StrategyFlow
						info(action.type, output === null ? output : "")
						return OK(output)
					}

					default:
						return BAD_REQUEST()
				}
			}
			default:
				METHOD_NOT_ALLOWED
		}
	} catch (error) {
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
