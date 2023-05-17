import {
  ApiActionResponseData,
  ApiActionResponseError,
  isAdminApiActionRequestData as isApiActionRequestData,
} from "@ggbot2/api";
import { readSession } from "@ggbot2/cookies";
import { readAccount, listAccountKeys } from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { UserWebappBaseURL } from "@ggbot2/locators";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const { DEPLOY_STAGE } = ENV;

const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);

const accessControlAllowOrigin = {
  "Access-Control-Allow-Origin": userWebappBaseURL.origin,
};

const BAD_REQUEST = (
  error?: ApiActionResponseError
): APIGatewayProxyResult => ({
  body: error ? JSON.stringify(error) : "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
});

const OK = (data: ApiActionResponseData["data"]): APIGatewayProxyResult => ({
  body: JSON.stringify({ data }),
  headers: {
    "Content-Type": "application/json",
    ...accessControlAllowOrigin,
  },
  isBase64Encoded: false,
  statusCode: __200__OK__,
});

const UNATHORIZED: APIGatewayProxyResult = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __401__UNAUTHORIZED__,
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "OPTIONS": {
      return {
        body: "",
        headers: {
          "Access-Control-Allow-Headers": "Content-type",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          ...accessControlAllowOrigin,
        },
        isBase64Encoded: false,
        statusCode: __200__OK__,
      };
    }

    case "POST": {
      if (!event.body) return BAD_REQUEST();

      const input = JSON.parse(event.body);

      if (!isApiActionRequestData(input)) return BAD_REQUEST();

      const session = readSession(req.cookies);
      if (!session) return UNATHORIZED;

      const { type: actionType } = input;

      switch (actionType) {
        case "ReadAccount": {
          const output = await readAccount(input.data);
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

    default: {
      return {
        body: "",
        headers: accessControlAllowOrigin,
        isBase64Encoded: false,
        statusCode: __405__METHOD_NOT_ALLOWED__,
      };
    }
  }
};
