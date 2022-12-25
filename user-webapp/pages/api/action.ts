import type { ReadBinanceApiKeyPermissions } from "@ggbot2/binance";
import {
  ErrorAccountItemNotFound,
  ErrorUnimplementedStrategyKind,
  copyStrategy,
  createBinanceApiConfig,
  createAccountStrategiesItemScheduling,
  removeAccountStrategiesItemSchedulings,
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
  readStrategyDailyOrders,
  readSubscription,
  renameAccount,
  setAccountCountry,
  renameStrategy,
  writeStrategyFlow,
} from "@ggbot2/database";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
  ErrorHTTP,
  InternalServerError,
} from "@ggbot2/http-status-codes";
import type {
  AccountKey,
  CopyStrategy,
  CreateBinanceApiConfig,
  CreateStrategy,
  CreateAccountStrategiesItemScheduling,
  RemoveAccountStrategiesItemSchedulings,
  DeleteAccount,
  DeleteBinanceApiConfig,
  DeleteStrategy,
  ExecuteStrategy,
  OperationInput,
  OperationOutput,
  ReadAccount,
  ReadAccountStrategies,
  ReadBinanceApiConfig,
  ReadStrategy,
  ReadStrategyBalances,
  ReadStrategyFlow,
  ReadStrategyDailyOrders,
  ReadSubscription,
  RenameAccount,
  RenameStrategy,
  SetAccountCountry,
  WriteStrategyFlow,
} from "@ggbot2/models";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { Dflow, DflowObject } from "dflow";
import type { NextApiRequest, NextApiResponse } from "next";
import { readSession } from "_routing";

const apiActionErrorNames = [
  ErrorHTTP.name,
  ErrorAccountItemNotFound.name,
  ErrorUnimplementedStrategyKind.name,
  InternalServerError.name,
] as const;
export type ApiActionErrorName = typeof apiActionErrorNames[number];

const isApiActionErrorName = (arg: unknown): arg is ApiActionErrorName => {
  if (typeof arg !== "string") return false;
  return (apiActionErrorNames as readonly string[]).includes(arg);
};

export type ApiActionError = {
  name: ApiActionErrorName;
  info?: DflowObject;
};

export const isApiActionError = objectTypeGuard<ApiActionError>(
  ({ name, info }) =>
    isApiActionErrorName(name) &&
    (info === undefined ? true : Dflow.isObject(info))
);

type ApiActionResponseError = {
  error: ApiActionError;
};

export const isApiActionResponseError = objectTypeGuard<ApiActionResponseError>(
  ({ error }) => isApiActionError(error)
);

export type ApiActionResponseOutput =
  | {
      data?: OperationOutput;
    }
  | ApiActionResponseError;

type Action<Input extends OperationInput> = {
  // AccountKey is provided by authentication, no need to add it as action input parameter.
  in: Input extends AccountKey ? Omit<Input, "accountId"> : Input;
  out: OperationOutput;
};

export type ApiAction = {
  CopyStrategy: Action<CopyStrategy["in"]>;
  CreateAccountStrategiesItemScheduling: Action<
    CreateAccountStrategiesItemScheduling["in"]
  >;
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
  ReadStrategyDailyOrders: Action<ReadStrategyDailyOrders["in"]>;
  ReadSubscription: Action<ReadSubscription["in"]>;
  RenameAccount: Action<RenameAccount["in"]>;
  RenameStrategy: Action<RenameStrategy["in"]>;
  RemoveAccountStrategiesItemSchedulings: Action<
    RemoveAccountStrategiesItemSchedulings["in"]
  >;
  SetAccountCountry: Action<SetAccountCountry["in"]>;
  WriteStrategyFlow: Action<WriteStrategyFlow["in"]>;
};

const apiActionTypes = [
  "CopyStrategy",
  "CreateAccountStrategiesItemScheduling",
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
  "ReadStrategyDailyOrders",
  "ReadSubscription",
  "RenameStrategy",
  "RemoveAccountStrategiesItemSchedulings",
  "RenameAccount",
  "SetAccountCountry",
  "WriteStrategyFlow",
] as const;
type ApiActionType = typeof apiActionTypes[number];
const isApiActionType = isLiteralType<ApiActionType>(apiActionTypes);

export type ApiActionInput = {
  type: ApiActionType;
  data?: OperationInput;
};

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiActionResponseOutput>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const action = req.body;

    const { type: actionType } = action;

    if (!isApiActionType(actionType))
      return res.status(__400__BAD_REQUEST__).json({});

    switch (actionType) {
      // Actions that do not require authentication.
      // //////////////////////////////////////////

      case "ReadStrategyFlow": {
        const data = await readStrategyFlow(action.data);
        return res.status(__200__OK__).json({ data });
      }

      default: {
        switch (actionType) {
          default: {
            const session = readSession(req.cookies);
            if (!session) return res.status(__401__UNAUTHORIZED__).json({});
            const { accountId } = session;

            switch (actionType) {
              // Actions that require authentication.
              // ///////////////////////////////////

              case "CopyStrategy": {
                const data = await copyStrategy({ accountId, ...action.data });
                return res.status(__200__OK__).json({ data });
              }

              case "CreateAccountStrategiesItemScheduling": {
                const data = await createAccountStrategiesItemScheduling({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              case "CreateBinanceApiConfig": {
                const data = await createBinanceApiConfig({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              case "CreateStrategy": {
                const data = await createStrategy({
                  accountId,
                  ...action.data,
                });
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
                const data = await deleteStrategy({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              case "ExecuteStrategy": {
                const data = await executeStrategy({
                  accountId,
                  ...action.data,
                });
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
                const data = await readStrategyBalances({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              case "ReadStrategyDailyOrders": {
                const data = await readStrategyDailyOrders({
                  accountId,
                  ...action.data,
                });
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
                const data = await renameStrategy({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              case "RemoveAccountStrategiesItemSchedulings": {
                const data = await removeAccountStrategiesItemSchedulings({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              case "SetAccountCountry": {
                const data = await setAccountCountry({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              case "WriteStrategyFlow": {
                const data = await writeStrategyFlow({
                  accountId,
                  ...action.data,
                });
                return res.status(__200__OK__).json({ data });
              }

              default:
                return res.status(__400__BAD_REQUEST__).json({});
            }
          }
        }
      }
    }
  } catch (error) {
    if (
      error instanceof ErrorAccountItemNotFound ||
      error instanceof ErrorUnimplementedStrategyKind
    )
      return res.status(__400__BAD_REQUEST__).json({ error: error.toObject() });

    console.error(error);
    res
      .status(__500__INTERNAL_SERVER_ERROR__)
      .json({ error: { name: InternalServerError.name } });
  }
}
