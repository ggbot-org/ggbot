import { isUserApiActionRequestData as isApiActionRequestData } from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
  UNATHORIZED,
} from "@ggbot2/api-gateway";
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
  ErrorAccountItemNotFound,
  ErrorExceededQuota,
  ErrorUnimplementedStrategyKind,
  isCopyStrategyInput,
  isCreateBinanceApiConfigInput,
  isCreateStrategyInput,
  isDeleteStrategyInput,
  isExecuteStrategyInput,
  isReadStrategyBalancesInput,
  isReadStrategyOrdersInput,
  isRenameAccountInput,
  isRenameStrategyInput,
  isSetAccountCountryInput,
  isWriteAccountStrategiesItemSchedulingsInput,
  isWriteStrategyFlowInput,
} from "@ggbot2/models";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case "OPTIONS":
        return ALLOWED_METHODS(["POST"]);

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
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isCopyStrategyInput(input)) return BAD_REQUEST();
            const output = await copyStrategy(input);
            return OK(output);
          }

          case "CreateBinanceApiConfig": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isCreateBinanceApiConfigInput(input)) return BAD_REQUEST();
            const output = await createBinanceApiConfig(input);
            return OK(output);
          }

          case "CreateStrategy": {
            if (!actionData) return BAD_REQUEST();
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
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isDeleteStrategyInput(input)) return BAD_REQUEST();
            const output = await deleteStrategy(input);
            return OK(output);
          }

          case "ExecuteStrategy": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isExecuteStrategyInput(input)) return BAD_REQUEST();
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
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isReadStrategyBalancesInput(input)) return BAD_REQUEST();
            const output = await readStrategyBalances(input);
            return OK(output);
          }

          case "ReadStrategyOrders": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isReadStrategyOrdersInput(input)) return BAD_REQUEST();
            const output = await readStrategyOrders(input);
            return OK(output);
          }

          case "ReadSubscription": {
            const output = await readSubscription({ accountId });
            return OK(output);
          }

          case "RenameAccount": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isRenameAccountInput(input)) return BAD_REQUEST();
            const output = await renameAccount(input);
            return OK(output);
          }

          case "RenameStrategy": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isRenameStrategyInput(input)) return BAD_REQUEST();
            const output = await renameStrategy(input);
            return OK(output);
          }

          case "SetAccountCountry": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isSetAccountCountryInput(input)) return BAD_REQUEST();
            const output = await setAccountCountry(input);
            return OK(output);
          }

          case "WriteAccountStrategiesItemSchedulings": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isWriteAccountStrategiesItemSchedulingsInput(input))
              return BAD_REQUEST();
            const output = await writeAccountStrategiesItemSchedulings(input);
            return OK(output);
          }

          case "WriteStrategyFlow": {
            if (!actionData) return BAD_REQUEST();
            const input = { accountId, ...actionData };
            if (!isWriteStrategyFlowInput(input)) return BAD_REQUEST();
            const output = await writeStrategyFlow(input);
            return OK(output);
          }

          default:
            return BAD_REQUEST();
        }
      }

      default:
        return METHOD_NOT_ALLOWED;
    }
  } catch (error) {
    if (
      error instanceof ErrorAccountItemNotFound ||
      error instanceof ErrorExceededQuota ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      return BAD_REQUEST(error.toObject());
    console.error(error);
  }
  return INTERNAL_SERVER_ERROR;
};
