import { isAdminApiActionRequestData as isApiActionRequestData } from "@ggbot2/api";
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
} from "@ggbot2/http-status-codes";
import { UserWebappBaseURL } from "@ggbot2/locators";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const { DEPLOY_STAGE } = ENV;

const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);

const accessControlAllowOrigin = {
  "Access-Control-Allow-Origin": userWebappBaseURL.origin,
};

const BAD_REQUEST: APIGatewayProxyResult = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
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
      if (!event.body) return BAD_REQUEST;

      const input = JSON.parse(event.body);

      if (!isApiActionRequestData(input)) return BAD_REQUEST;

      return {
        statusCode: __200__OK__,
        body: JSON.stringify({}),
      };
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
