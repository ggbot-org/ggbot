import {
  ApiActionResponseData,
  ApiActionResponseError,
  isUserApiActionRequestData as isApiActionRequestData,
} from "@ggbot2/api";
import { readSession } from "@ggbot2/cookies";
import {
  copyStrategy,
  createBinanceApiConfig,
  createStrategy,
  deleteAccount,
  deleteBinanceApiConfig,
  deleteStrategy,
  executeStrategy,
  readAccount,
  readAccountStrategies,
  readBinanceApiConfig,
  readBinanceApiKeyPermissions,
  readStrategy,
  readStrategyBalances,
  readStrategyOrders,
  readSubscription,
  renameAccount,
  renameStrategy,
  setAccountCountry,
  writeAccountStrategiesItemSchedulings,
  writeStrategyFlow,
} from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { UserWebappBaseURL } from "@ggbot2/locators";
import {
  ErrorExceededQuota,
  ErrorAccountItemNotFound,
  ErrorUnimplementedStrategyKind,
} from "@ggbot2/models";
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

        const cookies = event.headers.Cookie;
        if (!cookies) return UNATHORIZED;
        const session = readSession(cookies);
        if (!session) return UNATHORIZED;
        const { accountId } = session;

        const { type: actionType } = input;
        const actionData = input.data ?? {};

        switch (actionType) {
          case "CopyStrategy": {
            const output = await copyStrategy({ accountId, ...input.data });
            return OK(output);
          }

          case "CreateBinanceApiConfig": {
            const output = await createBinanceApiConfig({
              accountId,
              ...input.data,
            });
            return OK(output);
          }

          case "CreateStrategy": {
            const output = await createStrategy({ accountId, ...input.data });
            return OK(output);
          }

          case "DeleteAccount": {
            const output = await deleteAccount({ accountId });
            return OK(output);
          }

          case "DeleteBinanceApiConfig": {
            const output = await deleteBinanceApiConfig({ accountId });
            return OK(output);
          }

          case "DeleteStrategy": {
            const output = await deleteStrategy({ accountId, ...input.data });
            return OK(output);
          }

          case "ExecuteStrategy": {
            const output = await executeStrategy({
              accountId,
              ...input.data,
            });
            return OK(output);
          }

          case "ReadAccount": {
            const output = await readAccount({ accountId });
            return OK(output);
          }

          case "ReadAccountStrategies": {
            const output = await readAccountStrategies({ accountId });
            return OK(output);
          }

          case "ReadBinanceApiConfig": {
            const data = await readBinanceApiConfig({ accountId });
            if (!data) return OK(null);
            // Do not expose apiSecret.
            const { apiKey } = data;
            const output = { apiKey };
            return OK(output);
          }

          case "ReadBinanceApiKeyPermissions": {
            const output = await readBinanceApiKeyPermissions({ accountId });
            return OK(output);
          }

          case "ReadStrategy": {
            const output = await readStrategy(input.data);
            return OK(output);
          }

          case "ReadStrategyBalances": {
            const output = await readStrategyBalances({
              accountId,
              ...input.data,
            });
            return OK(output);
          }

          case "ReadStrategyOrders": {
            const output = await readStrategyOrders({
              accountId,
              ...input.data,
            });
            return OK(output);
          }

          case "ReadSubscription": {
            const output = await readSubscription({ accountId });
            return OK(output);
          }

          case "RenameAccount": {
            const output = await renameAccount({ accountId, ...input.data });
            return OK(output);
          }

          case "RenameStrategy": {
            const output = await renameStrategy({ accountId, ...input.data });
            return OK(output);
          }

          case "SetAccountCountry": {
            const output = await setAccountCountry({
              accountId,
              ...input.data,
            });
            return OK(output);
          }

          case "WriteAccountStrategiesItemSchedulings": {
            const output = await writeAccountStrategiesItemSchedulings({
              accountId,
              ...input.data,
            });
            return OK(output);
          }

          case "WriteStrategyFlow": {
            const output = await writeStrategyFlow({
              accountId,
              ...input.data,
            });
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
  } catch (error) {
    if (
      error instanceof ErrorAccountItemNotFound ||
      error instanceof ErrorExceededQuota ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      return BAD_REQUEST(error.toObject());
  }
};
