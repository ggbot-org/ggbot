import { ApiActionOutput } from "@workspace/api"

import { APIGatewayProxyResult } from "./types.js"

export const responseBody = (
	output: ApiActionOutput
): Pick<APIGatewayProxyResult, "body"> => ({ body: JSON.stringify(output) })
