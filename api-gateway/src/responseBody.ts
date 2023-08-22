import { ApiActionResponseOutput } from "@workspace/api"

import { APIGatewayProxyResult } from "./types.js"

export const responseBody = (
	output: ApiActionResponseOutput
): Pick<APIGatewayProxyResult, "body"> => ({ body: JSON.stringify(output) })
