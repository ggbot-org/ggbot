import { ALLOWED_METHODS,
	apiActionMethod,
	APIGatewayProxyHandler,
	BAD_REQUEST__400,
	BadGatewayError,
	errorResponse,
	GatewayTimeoutError,
	INTERNAL_SERVER_ERROR__500,
	isActionInput,
	METHOD_NOT_ALLOWED__405,
	OK,
	stripeClientActions,
	UNAUTHORIZED__401 } from '@workspace/api'
import { readSessionFromAuthorizationHeader } from '@workspace/authentication'

import { Service } from './service.js'

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod === 'OPTIONS') return ALLOWED_METHODS([apiActionMethod])

		if (event.httpMethod !== apiActionMethod) return errorResponse(METHOD_NOT_ALLOWED__405)

		if (!event.body) return errorResponse(BAD_REQUEST__400)

		const authorization = event.headers.Authorization
		const session = await readSessionFromAuthorizationHeader(authorization)
		if (!session) return errorResponse(UNAUTHORIZED__401)
		const service = new Service(session)

		const input: unknown = JSON.parse(event.body)
		if (!isActionInput(stripeClientActions)(input)) return errorResponse(BAD_REQUEST__400)

		const output = await service[input.type](input.data)
		return OK(output)
	} catch (error) {
		for (const ErrorClass of [BadGatewayError, GatewayTimeoutError]) if (error instanceof ErrorClass) {
			return errorResponse(ErrorClass.statusCode)
		}
		// Fallback if error is not handled: should not arrive here.
		console.error(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
