# API Gateway handler

To create an handler for an API Gateway resource, start from this sample code:
it implements an "echo" handler.

```ts
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__
} from "@ggbot2/http-status-codes";
import { UserWebappBaseURL } from "@ggbot2/locators";
import { objectTypeGuard } from "@ggbot2/type-utils";
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

type RequestData = {
  message: string;
};

const isRequestData = objectTypeGuard<RequestData>(
  ({ message }) => typeof message === "string"
);

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
        if (!event.body) return BAD_REQUEST;

        const input = JSON.parse(event.body);
        if (!isRequestData(input)) return BAD_REQUEST;

        const { message } = input;

        return {
          body: JSON.stringify({ message }),
          headers: {
            "Content-Type": "application/json",
            ...accessControlAllowOrigin,
          },
          isBase64Encoded: false,
          statusCode: __200__OK__,
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
```