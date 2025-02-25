import { commonHeaders } from './commonHeaders.js'
import { APIGatewayProxyResult } from './types.js'

export function errorResponse(
	statusCode: APIGatewayProxyResult['statusCode']
): APIGatewayProxyResult {
	return {
		body: '',
		headers: commonHeaders,
		isBase64Encoded: false,
		statusCode,
	}
}
