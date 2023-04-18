import {
  __200__OK__,
  __405__METHOD_NOT_ALLOWED__,
} from "@ggbot2/http-status-codes";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "POST": {
      return {
        statusCode: __200__OK__,
        body: JSON.stringify({}),
      };
    }
    default: {
      return {
        statusCode: __405__METHOD_NOT_ALLOWED__,
        body: JSON.stringify({}),
      };
    }
  }
};
