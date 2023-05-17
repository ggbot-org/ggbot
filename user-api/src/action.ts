import { ApiActionResponseError, ApiActionResponseOutput, isUserApiActionRequestData as isApiActionRequestData } from "@ggbot2/api";
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
  __500__INTERNAL_SERVER_ERROR__
} from "@ggbot2/http-status-codes";
import { UserWebappBaseURL } from "@ggbot2/locators";
import { ErrorExceededQuota, ErrorAccountItemNotFound, ErrorUnimplementedStrategyKind } from "@ggbot2/models";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const { DEPLOY_STAGE } = ENV;

const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);

const accessControlAllowOrigin = {
  "Access-Control-Allow-Origin": userWebappBaseURL.origin,
};

const BAD_REQUEST = (error?: ApiActionResponseError): APIGatewayProxyResult => ({
  body: error? JSON.stringify(error):"",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
});

const UNATHORIZED: APIGatewayProxyResult = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __401__UNAUTHORIZED__,
};

const OK = (output: ApiActionResponseOutput): APIGatewayProxyResult => ({
  statusCode: __200__OK__,
  body: JSON.stringify(output),
})

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

    const { type: actionType, } = input;
    const actionData = input.data??{}

    const session = readSession(req.cookies);
    if (!session) return UNATHORIZED
    const { accountId } = session;

    switch (actionType) {
      default: {
        switch (actionType) {
          case "CopyStrategy": {
            const data = await copyStrategy({ accountId, ...input.data });
            return OK({ data });
          }

          case "CreateBinanceApiConfig": {
            const data = await createBinanceApiConfig({
              accountId,
              ...input.data,
            });
            return OK({ data });
          }

          case "CreateStrategy": {
            const data = await createStrategy({ accountId, ...input.data });
            return OK({ data });
          }

          case "DeleteAccount": {
            const data = await deleteAccount({ accountId });
            return OK({ data });
          }

          case "DeleteBinanceApiConfig": {
            const data = await deleteBinanceApiConfig({ accountId });
            return OK({ data });
          }

          case "DeleteStrategy": {
            const data = await deleteStrategy({ accountId, ...input.data });
            return OK({ data });
          }

          case "ExecuteStrategy": {
            const data = await executeStrategy({ accountId, ...input.data });
            return OK({ data });
          }

          case "ReadAccount": {
            const data = await readAccount({ accountId });
            return OK({ data });
          }

          case "ReadAccountStrategies": {
            const data = await readAccountStrategies({ accountId });
            return OK({ data });
          }

          case "ReadBinanceApiConfig": {
            const data = await readBinanceApiConfig({ accountId });
            const apiKey = data?.apiKey;
            return OK( {
              // Do not expose apiSecret.
              data: apiKey ? { apiKey } : null,
              });
          }

          case "ReadBinanceApiKeyPermissions": {
            const data = await readBinanceApiKeyPermissions({ accountId });
            return OK({ data });
          }

          case "ReadStrategy": {
            const data = await readStrategy(action.data);
            return OK({ data });
          }

          case "ReadStrategyBalances": {
            const data = await readStrategyBalances({
              accountId,
              ...input.data,
            });
            return OK({ data });
          }

          case "ReadStrategyOrders": {
            const data = await readStrategyOrders({
              accountId,
              ...input.data,
            });
            return OK({ data });
          }

          case "ReadSubscription": {
            const data = await readSubscription({ accountId });
            return OK({ data });
          }

          case "RenameAccount": {
            const data = await renameAccount({ accountId, ...input.data });
            return OK({ data });
          }

          case "RenameStrategy": {
            const data = await renameStrategy({ accountId, ...input.data });
            return OK({ data });
          }

          case "SetAccountCountry": {
            const data = await setAccountCountry({ accountId, ...input.data });
            return OK({ data });
          }

          case "WriteAccountStrategiesItemSchedulings": {
            const data = await writeAccountStrategiesItemSchedulings({
              accountId,
              ...input.data,
            });
            return OK({ data });
          }

          case "WriteStrategyFlow": {
            const data = await writeStrategyFlow({ accountId, ...input.data });
            return OK({ data });
          }

          default:
            return BAD_REQUEST()
        }
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
    if (
      error instanceof ErrorAccountItemNotFound ||
      error instanceof ErrorExceededQuota ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      return res.status(__400__BAD_REQUEST__).json({ error: error.toObject() });

  }
};
