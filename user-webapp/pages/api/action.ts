import { Action, ApiActionResponseOutput } from "@ggbot2/api-action";
import { readSession } from "@ggbot2/cookies";
import { ReadBinanceApiKeyPermissions } from "@ggbot2/binance";
import {
  ErrorAccountItemNotFound,
  ErrorExceededQuota,
  ErrorUnimplementedStrategyKind,
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
  readStrategyFlow,
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
  InternalServerError,
} from "@ggbot2/http-status-codes";
import {
  CopyStrategy,
  CreateBinanceApiConfig,
  CreateStrategy,
  DeleteAccount,
  DeleteBinanceApiConfig,
  DeleteStrategy,
  ExecuteStrategy,
  ReadAccount,
  ReadAccountStrategies,
  ReadBinanceApiConfig,
  ReadStrategy,
  ReadStrategyBalances,
  ReadStrategyFlow,
  ReadStrategyOrders,
  ReadSubscription,
  RenameAccount,
  RenameStrategy,
  SetAccountCountry,
  WriteAccountStrategiesItemSchedulings,
  WriteStrategyFlow,
} from "@ggbot2/models";
import { isLiteralType } from "@ggbot2/type-utils";
import { NextApiRequest, NextApiResponse } from "next";

export type ApiAction = {
  CopyStrategy: Action<CopyStrategy["in"]>;
  CreateBinanceApiConfig: Action<CreateBinanceApiConfig["in"]>;
  CreateStrategy: Action<CreateStrategy["in"]>;
  DeleteAccount: Action<DeleteAccount["in"]>;
  DeleteBinanceApiConfig: Action<DeleteBinanceApiConfig["in"]>;
  DeleteStrategy: Action<DeleteStrategy["in"]>;
  ExecuteStrategy: Action<ExecuteStrategy["in"]>;
  ReadAccount: Action<ReadAccount["in"]>;
  ReadAccountStrategies: Action<ReadAccountStrategies["in"]>;
  ReadBinanceApiConfig: Action<ReadBinanceApiConfig["in"]>;
  ReadBinanceApiKeyPermissions: Action<ReadBinanceApiKeyPermissions["in"]>;
  ReadStrategy: Action<ReadStrategy["in"]>;
  ReadStrategyBalances: Action<ReadStrategyBalances["in"]>;
  ReadStrategyFlow: Action<ReadStrategyFlow["in"]>;
  ReadStrategyOrders: Action<ReadStrategyOrders["in"]>;
  ReadSubscription: Action<ReadSubscription["in"]>;
  RenameAccount: Action<RenameAccount["in"]>;
  RenameStrategy: Action<RenameStrategy["in"]>;
  SetAccountCountry: Action<SetAccountCountry["in"]>;
  WriteAccountStrategiesItemSchedulings: Action<WriteAccountStrategiesItemSchedulings["in"]>;
  WriteStrategyFlow: Action<WriteStrategyFlow["in"]>;
};

const apiActionTypes = [
  "CopyStrategy",
  "CreateBinanceApiConfig",
  "CreateStrategy",
  "DeleteAccount",
  "DeleteStrategy",
  "DeleteBinanceApiConfig",
  "ExecuteStrategy",
  "ReadAccount",
  "ReadAccountStrategies",
  "ReadBinanceApiConfig",
  "ReadBinanceApiKeyPermissions",
  "ReadStrategy",
  "ReadStrategyBalances",
  "ReadStrategyFlow",
  "ReadStrategyOrders",
  "ReadSubscription",
  "RenameStrategy",
  "RenameAccount",
  "SetAccountCountry",
  "WriteAccountStrategiesItemSchedulings",
  "WriteStrategyFlow",
] as const;
export type ApiActionType = typeof apiActionTypes[number];
const isApiActionType = isLiteralType<ApiActionType>(apiActionTypes);

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiActionResponseOutput>
) {
  try {
    if (req.method !== "POST") return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const action = req.body;

    const { type: actionType } = action;

    if (!isApiActionType(actionType)) return res.status(__400__BAD_REQUEST__).json({});

    // Actions that do not require authentication.
    // //////////////////////////////////////////

    switch (actionType) {
      case "ReadStrategyFlow": {
        const data = await readStrategyFlow(action.data);
        return res.status(__200__OK__).json({ data });
      }

      default:
        break;
    }

    // Actions that require authentication.
    // ///////////////////////////////////

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});
    const { accountId } = session;

    switch (actionType) {
      default: {
        switch (actionType) {
          case "CopyStrategy": {
            const data = await copyStrategy({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "CreateBinanceApiConfig": {
            const data = await createBinanceApiConfig({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "CreateStrategy": {
            const data = await createStrategy({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "DeleteAccount": {
            const data = await deleteAccount({ accountId });
            return res.status(__200__OK__).json({ data });
          }

          case "DeleteBinanceApiConfig": {
            const data = await deleteBinanceApiConfig({ accountId });
            return res.status(__200__OK__).json({ data });
          }

          case "DeleteStrategy": {
            const data = await deleteStrategy({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "ExecuteStrategy": {
            const data = await executeStrategy({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "ReadAccount": {
            const data = await readAccount({ accountId });
            return res.status(__200__OK__).json({ data });
          }

          case "ReadAccountStrategies": {
            const data = await readAccountStrategies({ accountId });
            return res.status(__200__OK__).json({ data });
          }

          case "ReadBinanceApiConfig": {
            const data = await readBinanceApiConfig({ accountId });
            const apiKey = data?.apiKey;
            return res.status(__200__OK__).json({
              // Do not expose apiSecret.
              data: apiKey ? { apiKey } : null,
            });
          }

          case "ReadBinanceApiKeyPermissions": {
            const data = await readBinanceApiKeyPermissions({ accountId });
            return res.status(__200__OK__).json({ data });
          }

          case "ReadStrategy": {
            const data = await readStrategy(action.data);
            return res.status(__200__OK__).json({ data });
          }

          case "ReadStrategyBalances": {
            const data = await readStrategyBalances({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "ReadStrategyOrders": {
            const data = await readStrategyOrders({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "ReadSubscription": {
            const data = await readSubscription({ accountId });
            return res.status(__200__OK__).json({ data });
          }

          case "RenameAccount": {
            const data = await renameAccount({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "RenameStrategy": {
            const data = await renameStrategy({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "SetAccountCountry": {
            const data = await setAccountCountry({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "WriteAccountStrategiesItemSchedulings": {
            const data = await writeAccountStrategiesItemSchedulings({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          case "WriteStrategyFlow": {
            const data = await writeStrategyFlow({ accountId, ...action.data });
            return res.status(__200__OK__).json({ data });
          }

          default:
            return res.status(__400__BAD_REQUEST__).json({});
        }
      }
    }
  } catch (error) {
    if (
      error instanceof ErrorAccountItemNotFound ||
      error instanceof ErrorExceededQuota ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      return res.status(__400__BAD_REQUEST__).json({ error: error.toObject() });

    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({ error: { name: InternalServerError.name } });
  }
}
