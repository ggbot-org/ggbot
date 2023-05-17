import { ENV } from "@ggbot2/env";
import { ApiActionResponseData, ApiActionResponseError } from "@ggbot2/api";
import { UserWebappBaseURL } from "@ggbot2/locators";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { APIGatewayProxyResult } from "aws-lambda";

const { DEPLOY_STAGE } = ENV;

const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);

const accessControlAllowOrigin = {
  "Access-Control-Allow-Origin": userWebappBaseURL.origin,
};

export const BAD_REQUEST = (
  error?: ApiActionResponseError["error"]
): APIGatewayProxyResult => ({
  body: error ? JSON.stringify(error) : "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
});
