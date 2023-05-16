import { deleteSessionCookie } from "@ggbot2/cookies";
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

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "OPTIONS": {
      return {
        body: "",
        headers: {
          "Access-Control-Allow-Headers": "Content-type",
          "Access-Control-Allow-Methods": "OPTIONS, GET",
          ...accessControlAllowOrigin,
        },
        isBase64Encoded: false,
        statusCode: __200__OK__,
      };
    }

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

    default: {
      return {
        body: "",
        headers: {
          ...accessControlAllowOrigin,
        },
        isBase64Encoded: false,
        statusCode: __405__METHOD_NOT_ALLOWED__,
      };
    }
  }
};
