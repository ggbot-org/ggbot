import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@ggbot2/api-gateway"
import { readStrategy, readStrategyFlow } from "@ggbot2/database"
import { isDev } from "@ggbot2/env"
import { isReadStrategyFlowInput, isReadStrategyInput } from "@ggbot2/models"
import { isPublicApiActionRequestData as isApiActionRequestData } from "@workspace/api"

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				if (!event.body) return BAD_REQUEST()

				const action = JSON.parse(event.body)

				if (!isApiActionRequestData(action)) return BAD_REQUEST()
				const actionData = action.data

				switch (action.type) {
					case "ReadStrategy": {
						if (!isReadStrategyInput(actionData))
							return BAD_REQUEST()
						const output = await readStrategy(actionData)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadStrategyFlow": {
						if (!isReadStrategyFlowInput(actionData))
							return BAD_REQUEST()
						const output = await readStrategyFlow(actionData)
						// Omit StrategyFlow
						if (isDev)
							console.info(
								action.type,
								output === null ? output : ""
							)
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
