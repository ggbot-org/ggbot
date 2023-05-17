import {
  ApiActionResponseData,
  ApiActionResponseError,
  isPublicApiActionRequestData as isApiActionRequestData,
} from "@ggbot2/api";
import { readStrategyFlow } from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
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

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
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

        const { type: actionType } = input;
        const actionData = action.data;

        switch (actionType) {
          case "ReadStrategy": {
            const output = await readStrategy(actionData);
            return OK(output);
          }

          case "ReadStrategyFlow": {
            const output = await readStrategyFlow(actionData);
            return OK(output);
          }

          default: {
          }
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
  } catch (error) {
    console.error(error);
    return {
      body: "",
      headers: accessControlAllowOrigin,
      isBase64Encoded: false,
      statusCode: __500__INTERNAL_SERVER_ERROR__,
    };
  }
};
