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
import { today } from "minimal-time-helpers"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				if (!event.body) return BAD_REQUEST()

				const input = JSON.parse(event.body)

				if (isApiAuthVerifyRequestData(input)) {
					const { code, email } = input

					const storedOneTimePassword =
						await readOneTimePassword(email)

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
						output.jwt = signSession(session)
					} else {
						const account = await createAccount({ email })
						const session = { creationDay, accountId: account.id }
						output.jwt = signSession(session)
					}

					return OK(output)
				}

				return BAD_REQUEST()
			}

			default:
				return METHOD_NOT_ALLOWED
		}
	} catch (error) {
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}