import {
	ApiAuthEnterResponseData,
	isApiAuthEnterRequestData
} from "@workspace/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import { createOneTimePassword } from "@workspace/database"
import { BadGatewayError } from "@workspace/http"

import { warn } from "./logging.js"
import { sendOneTimePassword } from "./sendOneTimePassword.js"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS(["POST"])

		if (event.httpMethod === "POST") {
			if (!event.body) return BAD_REQUEST()

			const input: unknown = JSON.parse(event.body)

			if (isApiAuthEnterRequestData(input)) {
				const { email } = input

				const language = "en"
				const oneTimePassword = await createOneTimePassword(email)
				await sendOneTimePassword({
					language,
					email,
					oneTimePassword
				})

				const output: ApiAuthEnterResponseData = {
					emailSent: true
				}

				return OK(output)
			}
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof BadGatewayError) return BAD_REQUEST()
		// Fallback to print error if not handled.
		warn(error)
	}
	return INTERNAL_SERVER_ERROR
}
