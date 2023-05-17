import { deleteSessionCookie } from "@ggbot2/cookies";
import {
  ALLOWED_METHODS,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
} from "@ggbot2/api-gateway";
import { __200__OK__ } from "@ggbot2/http";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case "OPTIONS":
        return ALLOWED_METHODS(["GET"]);

      case "GET": {
        const cookie = deleteSessionCookie();

        return {
          body: "",
          headers: {
            "Set-Cookie": cookie,
          },
          isBase64Encoded: false,
          statusCode: __200__OK__,
        };
      }

      default:
        METHOD_NOT_ALLOWED;
    }
  } catch (error) {
    console.error(error);
  }
  return INTERNAL_SERVER_ERROR;
};
