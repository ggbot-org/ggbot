import { isAdminApiActionRequestData as isApiActionRequestData } from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
  UNATHORIZED,
} from "@ggbot2/api-gateway";
import { readSession } from "@ggbot2/cookies";
import { listAccountKeys, readAccount } from "@ggbot2/database";
import { isReadAccountInput } from "@ggbot2/models";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case "OPTIONS":
        return ALLOWED_METHODS(["POST"]);

      case "POST": {
        if (!event.body) return BAD_REQUEST();

        const action = JSON.parse(event.body);

        if (!isApiActionRequestData(action)) return BAD_REQUEST();
        const actionData = action.data;

        const cookies = event.headers.Cookie;
        if (!cookies) return UNATHORIZED;
        const session = readSession(cookies);
        if (!session) return UNATHORIZED;

        switch (action.type) {
          case "ReadAccount": {
            if (!isReadAccountInput(actionData)) return BAD_REQUEST();
            const output = await readAccount(actionData);
            return OK(output);
          }

          case "ListAccountKeys": {
            const output = await listAccountKeys();
            return OK(output);
          }

          default:
            return BAD_REQUEST();
        }
      }

      default:
        return METHOD_NOT_ALLOWED;
    }
  } catch (error) {
    console.error(error);
  }
  return INTERNAL_SERVER_ERROR;
};
