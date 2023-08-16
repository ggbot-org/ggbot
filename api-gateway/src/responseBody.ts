import { ApiActionResponseOutput } from "@ggbot2/api"

import { APIGatewayProxyResult } from "./types.js"

export const responseBody = (
	output: ApiActionResponseOutput
): Pick<APIGatewayProxyResult, "body"> => ({ body: JSON.stringify(output) })
