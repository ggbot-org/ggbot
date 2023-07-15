import { isAdminApiActionRequestData as isApiActionRequestData } from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
  UNATHORIZED,
} from "@ggbot2/api-gateway";
import {
  ErrorUnauthorizedAuthenticationHeader,
  readSessionFromAuthorizationHeader,
} from "@ggbot2/authentication";
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

        readSessionFromAuthorizationHeader(event.headers.Authorization);

        const action = JSON.parse(event.body);

        if (!isApiActionRequestData(action)) return BAD_REQUEST();
        const actionData = action.data;

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
    if (error instanceof ErrorUnauthorizedAuthenticationHeader)
      return UNATHORIZED;
    console.error(error);
  }
  return INTERNAL_SERVER_ERROR;
};
