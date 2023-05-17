import { ApiActionResponseData, ApiActionResponseError } from "@ggbot2/api";
import { ENV } from "@ggbot2/env";
import { HTTP_METHOD } from "@ggbot2/http";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http";
import { UserWebappBaseURL } from "@ggbot2/locators";
import { APIGatewayProxyResult } from "aws-lambda";

const { DEPLOY_STAGE } = ENV;

const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);

const accessControlAllowOrigin = {
  "Access-Control-Allow-Origin": userWebappBaseURL.origin,
};

export const ALLOWED_METHODS = (methods: HTTP_METHOD[]) => ({
  body: "",
  headers: {
    "Access-Control-Allow-Headers": "Content-type",
    "Access-Control-Allow-Methods": ["OPTIONS"].concat(methods).join(),
    ...accessControlAllowOrigin,
  },
  isBase64Encoded: false,
  statusCode: __200__OK__,
});

export const BAD_REQUEST = (
  error?: ApiActionResponseError["error"]
): APIGatewayProxyResult => ({
  body: error ? JSON.stringify(error) : "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
});

export const INTERNAL_SERVER_ERROR: APIGatewayProxyResult = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __500__INTERNAL_SERVER_ERROR__,
};

export const METHOD_NOT_ALLOWED = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __405__METHOD_NOT_ALLOWED__,
};

export const OK = (
  data: ApiActionResponseData["data"]
): APIGatewayProxyResult => ({
  body: JSON.stringify({ data }),
  headers: {
    "Content-Type": "application/json",
    ...accessControlAllowOrigin,
  },
  isBase64Encoded: false,
  statusCode: __200__OK__,
});

export const UNATHORIZED: APIGatewayProxyResult = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __401__UNAUTHORIZED__,
};
