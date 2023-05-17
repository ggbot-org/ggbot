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
  readStrategyBalances,
  readStrategyOrders,
  readSubscription,
  renameAccount,
  renameStrategy,
  setAccountCountry,
  writeAccountStrategiesItemSchedulings,
  writeStrategyFlow,
} from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import {
  ErrorExceededQuota,
  ErrorAccountItemNotFound,
  ErrorUnimplementedStrategyKind,
  isCopyStrategyInput,
  isCreateBinanceApiConfigInput,
  isCreateStrategyInput,
} from "@ggbot2/models";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

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

        const action = JSON.parse(event.body);

        if (!isApiActionRequestData(action)) return BAD_REQUEST();
        const actionData = action.data;

        const cookies = event.headers.Cookie;
        if (!cookies) return UNATHORIZED;
        const session = readSession(cookies);
        if (!session) return UNATHORIZED;
        const { accountId } = session;

        switch (action.type) {
          case "CopyStrategy": {
            const input = { accountId, ...actionData };
            if (!isCopyStrategyInput(input)) return BAD_REQUEST();
            const output = await copyStrategy(input);
            return OK(output);
          }

          case "CreateBinanceApiConfig": {
            const input = { accountId, ...actionData };
            if (!isCreateBinanceApiConfigInput(input)) return BAD_REQUEST();
            const output = await createBinanceApiConfig(input);
            return OK(output);
          }

          case "CreateStrategy": {
            const input = { accountId, ...actionData };
            if (!isCreateStrategyInput(input)) return BAD_REQUEST();
            const output = await createStrategy(input);
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
            const input = { accountId, ...actionData };
            const output = await deleteStrategy(input);
            return OK(output);
          }

          case "ExecuteStrategy": {
            const input = { accountId, ...actionData };
            const output = await executeStrategy(input);
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

          case "ReadStrategyBalances": {
            const output = await readStrategyBalances({
              accountId,
              ...input.data,
            });
            return OK(output);
          }

          case "ReadStrategyOrders": {
            const input = { accountId, ...actionData };
            const output = await readStrategyOrders(input);
            return OK(output);
          }

          case "ReadSubscription": {
            const output = await readSubscription({ accountId });
            return OK(output);
          }

          case "RenameAccount": {
            const input = { accountId, ...actionData };
            const output = await renameAccount(input);
            return OK(output);
          }

          case "RenameStrategy": {
            const input = { accountId, ...actionData };
            const output = await renameStrategy(input);
            return OK(output);
          }

          case "SetAccountCountry": {
            const input = { accountId, ...actionData };
            const output = await setAccountCountry(input);
            return OK(output);
          }

          case "WriteAccountStrategiesItemSchedulings": {
            const input = { accountId, ...actionData };
            const output = await writeAccountStrategiesItemSchedulings(input);
            return OK(output);
          }

          case "WriteStrategyFlow": {
            const input = { accountId, ...actionData };
            const output = await writeStrategyFlow(input);
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
