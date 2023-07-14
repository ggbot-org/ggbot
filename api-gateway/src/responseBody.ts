import { ApiActionResponseOutput } from "@ggbot2/api";
import { APIGatewayProxyResult } from "aws-lambda";

export const responseBody = (
  output: ApiActionResponseOutput
): Pick<APIGatewayProxyResult, "body"> => ({ body: JSON.stringify(output) });
