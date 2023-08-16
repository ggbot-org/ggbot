# API Gateway handler

To create an handler for an API Gateway resource, start from this sample code:
it implements an "echo" handler.

```ts
import {
	ALLOWED_METHODS,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK,
	APIGatewayProxyHandler
} from "@ggbot2/api-gateway"
import { UserWebappBaseURL } from "@ggbot2/locators"
import { objectTypeGuard } from "@ggbot2/type-utils"

type RequestData = {
	message: string
}

type ResponseData = {
	message: string
}

const isRequestData = objectTypeGuard<RequestData>(
	({ message }) => typeof message === "string"
)

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				if (!event.body) return BAD_REQUEST()

				const input = JSON.parse(event.body)
				if (!isRequestData(input)) return BAD_REQUEST()

				const { message } = input

				const output: ResponseData = { message }
				return OK(output)
			}

			default:
				return METHOD_NOT_ALLOWED
		}
	} catch (error) {
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
```
