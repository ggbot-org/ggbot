import { ReadBinanceApiKeyPermissions } from "@ggbot2/binance";
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
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { AuthenticatedApiAction as Action, ApiActionInput } from "./apiAction";

export const userApiActionTypes = [
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
export type UserApiActionType = (typeof userApiActionTypes)[number];
export const isUserApiActionType =
  isLiteralType<UserApiActionType>(userApiActionTypes);

export type UserApiAction = {
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
  WriteAccountStrategiesItemSchedulings: Action<
    WriteAccountStrategiesItemSchedulings["in"]
  >;
  WriteStrategyFlow: Action<WriteStrategyFlow["in"]>;
};

export type UserApiActionRequestData = ApiActionInput<UserApiActionType>;

export const isUserApiActionRequestData =
  objectTypeGuard<UserApiActionRequestData>(
    ({ type }) => isUserApiActionType(type)
    // TODO check data
  );