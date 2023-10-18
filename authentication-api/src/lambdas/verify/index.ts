import {
	ApiAuthVerifyResponseData,
	isApiAuthVerifyRequestData
} from "@workspace/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import { signSession } from "@workspace/authentication"
import {
	createAccount,
	deleteOneTimePassword,
	readEmailAccount,
	readOneTimePassword
} from "@workspace/database"
import { BadGatewayError } from "@workspace/http"
import { today } from "minimal-time-helpers"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === "OPTIONS") return ALLOWED_METHODS(["POST"])

		if (event.httpMethod === "POST") {
			if (!event.body) return BAD_REQUEST()

			const input: unknown = JSON.parse(event.body)

			if (isApiAuthVerifyRequestData(input)) {
				const { code, email } = input

				const storedOneTimePassword = await readOneTimePassword(email)

				if (!storedOneTimePassword) {
					return OK(null)
				}

				const verified = code === storedOneTimePassword?.code

				const output: ApiAuthVerifyResponseData = {}

				if (!verified) return OK(output)

				await deleteOneTimePassword(email)

				const emailAccount = await readEmailAccount(email)

				const creationDay = today()

				if (emailAccount) {
					const session = {
						creationDay,
						accountId: emailAccount.accountId
					}
					const jwt: unknown = signSession(session)
					if (typeof jwt !== "string") return INTERNAL_SERVER_ERROR
					output.jwt = jwt
				} else {
					const account = await createAccount({ email })
					const session = { creationDay, accountId: account.id }
					const jwt: unknown = signSession(session)
					if (typeof jwt !== "string") return INTERNAL_SERVER_ERROR
					output.jwt = jwt
				}

				return OK(output)
			}
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof BadGatewayError) return BAD_REQUEST()
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
