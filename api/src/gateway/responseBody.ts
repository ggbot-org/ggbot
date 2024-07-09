import { ApiActionOutput } from "../action.js"
import { APIGatewayProxyResult } from "./types.js"

export function responseBody(
	output: ApiActionOutput
): Pick<APIGatewayProxyResult, "body"> {
	return { body: JSON.stringify(output) }
}
