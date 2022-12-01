import type { ReadBinanceApiKeyPermissions } from "@ggbot2/binance";
import {
  ErrorAccountItemNotFound,
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
  renameAccount,
  renameStrategy,
  updateAccountStrategiesItem,
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
import {
  AccountKey,
  CopyStrategy,
  CreateBinanceApiConfig,
  CreateStrategy,
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
  RenameAccount,
  RenameStrategy,
  UpdateAccountStrategiesItem,
  WriteStrategyFlow,
  objectTypeGuard,
} from "@ggbot2/models";
import { Dflow, DflowObject } from "dflow";
import type { NextApiRequest, NextApiResponse } from "next";
import { readSession } from "_routing";

export type ApiActionInputData = OperationInput;
type ApiActionOutputData = OperationOutput;

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

export type ApiActionResponseOutput<T> =
  | {
      data?: T;
    }
  | ApiActionResponseError;

type Action<Input extends OperationInput> = {
  // AccountKey is provided by authentication, no need to add it as action input parameter.
  in: Input extends AccountKey ? Omit<Input, "accountId"> : Input;
  out: OperationOutput;
};

export type ApiAction = {
  COPY_STRATEGY: Action<CopyStrategy["in"]>;
  CREATE_BINANCE_API_CONFIG: Action<CreateBinanceApiConfig["in"]>;
  CREATE_STRATEGY: Action<CreateStrategy["in"]>;
  DELETE_ACCOUNT: Action<DeleteAccount["in"]>;
  DELETE_BINANCE_API_CONFIG: Action<DeleteBinanceApiConfig["in"]>;
  DELETE_STRATEGY: Action<DeleteStrategy["in"]>;
  EXECUTE_STRATEGY: Action<ExecuteStrategy["in"]>;
  READ_ACCOUNT: Action<ReadAccount["in"]>;
  READ_ACCOUNT_STRATEGIES: Action<ReadAccountStrategies["in"]>;
  READ_BINANCE_API_CONFIG: Action<ReadBinanceApiConfig["in"]>;
  READ_BINANCE_API_KEY_PERMISSIONS: Action<ReadBinanceApiKeyPermissions["in"]>;
  READ_STRATEGY_FLOW: Action<ReadStrategyFlow["in"]>;
  READ_STRATEGY: Action<ReadStrategy["in"]>;
  READ_STRATEGY_BALANCES: Action<ReadStrategyBalances["in"]>;
  RENAME_ACCOUNT: Action<RenameAccount["in"]>;
  RENAME_STRATEGY: Action<RenameStrategy["in"]>;
  UPDATE_ACCOUNT_STRATEGIES_ITEM: Action<UpdateAccountStrategiesItem["in"]>;
  WRITE_STRATEGY_FLOW: Action<WriteStrategyFlow["in"]>;
};

type ApiActionType = keyof ApiAction;

export type ApiActionInput = {
  type: ApiActionType;
  data?: ApiActionInputData;
};

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiActionResponseOutput<ApiActionOutputData>>
) {
  try {
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});

    const { accountId } = session;

    const action = req.body;

    switch (action.type as ApiActionType) {
      case "COPY_STRATEGY": {
        const data = await copyStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "CREATE_BINANCE_API_CONFIG": {
        const data = await createBinanceApiConfig({
          accountId,
          ...action.data,
        });
        return res.status(__200__OK__).json({ data });
      }

      case "CREATE_STRATEGY": {
        const data = await createStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "DELETE_ACCOUNT": {
        const data = await deleteAccount({ accountId });
        return res.status(__200__OK__).json({ data });
      }

      case "DELETE_BINANCE_API_CONFIG": {
        const data = await deleteBinanceApiConfig({ accountId });
        return res.status(__200__OK__).json({ data });
      }

      case "DELETE_STRATEGY": {
        const data = await deleteStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "EXECUTE_STRATEGY": {
        const data = await executeStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "READ_ACCOUNT": {
        const data = await readAccount({ accountId });
        return res.status(__200__OK__).json({ data });
      }

      case "READ_ACCOUNT_STRATEGIES": {
        const data = await readAccountStrategies({ accountId });
        return res.status(__200__OK__).json({ data });
      }

      case "READ_BINANCE_API_CONFIG": {
        const data = await readBinanceApiConfig({ accountId });
        const apiKey = data?.apiKey;
        return res.status(__200__OK__).json({
          // Do not expose apiSecret.
          data: apiKey ? { apiKey } : null,
        });
      }

      case "READ_BINANCE_API_KEY_PERMISSIONS": {
        const data = await readBinanceApiKeyPermissions({ accountId });
        return res.status(__200__OK__).json({ data });
      }

      case "READ_STRATEGY": {
        const data = await readStrategy(action.data);
        return res.status(__200__OK__).json({ data });
      }

      case "READ_STRATEGY_BALANCES": {
        const data = await readStrategyBalances(action.data);
        return res.status(__200__OK__).json({ data });
      }

      case "READ_STRATEGY_FLOW": {
        const data = await readStrategyFlow(action.data);
        return res.status(__200__OK__).json({ data });
      }

      case "RENAME_ACCOUNT": {
        const data = await renameAccount({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "RENAME_STRATEGY": {
        const data = await renameStrategy({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      case "UPDATE_ACCOUNT_STRATEGIES_ITEM": {
        const data = await updateAccountStrategiesItem({
          accountId,
          ...action.data,
        });
        return res.status(__200__OK__).json({ data });
      }

      case "WRITE_STRATEGY_FLOW": {
        const data = await writeStrategyFlow({ accountId, ...action.data });
        return res.status(__200__OK__).json({ data });
      }

      default:
        return res.status(__400__BAD_REQUEST__).json({});
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
