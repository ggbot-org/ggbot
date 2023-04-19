import { isUserApiActionType } from "@ggbot2/api";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
} from "@ggbot2/http-status-codes";
import { isMaybeObject } from "@ggbot2/type-utils";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const BAD_REQUEST = {
    statusCode: __400__BAD_REQUEST__,
    body: JSON.stringify({}),
  };

  switch (event.httpMethod) {
    case "POST": {
      if (!event.body) return BAD_REQUEST;

      const action = JSON.parse(event.body);

      if (!isMaybeObject<{ type: string }>(action)) return BAD_REQUEST;

      if (!isUserApiActionType(action.type)) return BAD_REQUEST;

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
