import { ReadBinanceApiKeyPermissions } from "@ggbot2/binance";
import {
  CopyStrategy,
  CreateBinanceApiConfig,
  CreateStrategy,
  DeleteAccount,
  DeleteBinanceApiConfig,
  DeleteStrategy,
  ReadAccount,
  ReadAccountStrategies,
  ReadBinanceApiConfig,
  ReadStrategyBalances,
  ReadStrategyOrders,
  ReadSubscription,
  RenameAccount,
  RenameStrategy,
  SetAccountCountry,
  WriteAccountStrategiesItemSchedulings,
  WriteStrategyFlow,
} from "@ggbot2/models";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { Dflow } from "dflow";

import {
  ApiActionInput,
  AuthenticatedApiAction as Action,
} from "./apiAction.js";

export const userApiActionTypes = [
  "CopyStrategy",
  "CreateBinanceApiConfig",
  "CreateStrategy",
  "DeleteAccount",
  "DeleteStrategy",
  "DeleteBinanceApiConfig",
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
  ReadAccount: Action<ReadAccount["in"]>;
  ReadAccountStrategies: Action<ReadAccountStrategies["in"]>;
  ReadBinanceApiConfig: Action<ReadBinanceApiConfig["in"]>;
  ReadBinanceApiKeyPermissions: Action<ReadBinanceApiKeyPermissions["in"]>;
  ReadStrategyBalances: Action<ReadStrategyBalances["in"]>;
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
  objectTypeGuard<UserApiActionRequestData>(({ data, type }) =>
    isUserApiActionType(type) && data === undefined
      ? true
      : Dflow.isObject(data)
  );
