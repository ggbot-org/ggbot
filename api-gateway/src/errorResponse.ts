import { commonHeaders } from "./commonHeaders.js"
import { APIGatewayProxyResult } from "./types.js"

export const errorResponse = (
	statusCode: APIGatewayProxyResult["statusCode"]
): APIGatewayProxyResult => ({
	body: "",
	headers: commonHeaders,
	isBase64Encoded: false,
	statusCode
})
