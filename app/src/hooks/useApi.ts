import { PublicApiActionType, UserApiActionType } from "@ggbot2/api";
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
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const publicApiOptions = { endpoint: url.apiPublicAction };
const userApiOptions = { endpoint: url.apiUserAction, withJwt: true };

const publicApi = {
  ReadStrategy: () =>
    useAction<ReadStrategy, PublicApiActionType>(
      publicApiOptions,
      "ReadStrategy"
    ),
  ReadStrategyFlow: () =>
    useAction<ReadStrategyFlow, PublicApiActionType>(
      publicApiOptions,
      "ReadStrategyFlow"
    ),
};

const userApi = {
  CopyStrategy: () =>
    useAction<CopyStrategy, UserApiActionType>(userApiOptions, "CopyStrategy"),
  CreateBinanceApiConfig: () =>
    useAction<CreateBinanceApiConfig, UserApiActionType>(
      userApiOptions,
      "CreateBinanceApiConfig"
    ),
  CreateStrategy: () =>
    useAction<CreateStrategy, UserApiActionType>(
      userApiOptions,
      "CreateStrategy"
    ),
  DeleteAccount: () =>
    useAction<DeleteAccount, UserApiActionType>(
      userApiOptions,
      "DeleteAccount"
    ),
  DeleteBinanceApiConfig: () =>
    useAction<DeleteBinanceApiConfig, UserApiActionType>(
      userApiOptions,
      "DeleteBinanceApiConfig"
    ),
  DeleteStrategy: () =>
    useAction<DeleteStrategy, UserApiActionType>(
      userApiOptions,
      "DeleteStrategy"
    ),
  ReadAccount: () =>
    useAction<ReadAccount, UserApiActionType>(userApiOptions, "ReadAccount"),
  ReadAccountStrategies: () =>
    useAction<ReadAccountStrategies, UserApiActionType>(
      userApiOptions,
      "ReadAccountStrategies"
    ),
  ReadBinanceApiConfig: () =>
    useAction<ReadBinanceApiConfig, UserApiActionType>(
      userApiOptions,
      "ReadBinanceApiConfig"
    ),
  ReadBinanceApiKeyPermissions: () =>
    useAction<ReadBinanceApiKeyPermissions, UserApiActionType>(
      userApiOptions,
      "ReadBinanceApiKeyPermissions"
    ),
  ReadStrategyBalances: () =>
    useAction<ReadStrategyBalances, UserApiActionType>(
      userApiOptions,
      "ReadStrategyBalances"
    ),
  ReadStrategyOrders: () =>
    useAction<ReadStrategyOrders, UserApiActionType>(
      userApiOptions,
      "ReadStrategyOrders"
    ),
  ReadSubscription: () =>
    useAction<ReadSubscription, UserApiActionType>(
      userApiOptions,
      "ReadSubscription"
    ),
  RenameAccount: () =>
    useAction<RenameAccount, UserApiActionType>(
      userApiOptions,
      "RenameAccount"
    ),
  RenameStrategy: () =>
    useAction<RenameStrategy, UserApiActionType>(
      userApiOptions,
      "RenameStrategy"
    ),
  SetAccountCountry: () =>
    useAction<SetAccountCountry, UserApiActionType>(
      userApiOptions,
      "SetAccountCountry"
    ),
  WriteAccountStrategiesItemSchedulings: () =>
    useAction<WriteAccountStrategiesItemSchedulings, UserApiActionType>(
      userApiOptions,
      "WriteAccountStrategiesItemSchedulings"
    ),
  WriteStrategyFlow: () =>
    useAction<WriteStrategyFlow, UserApiActionType>(
      userApiOptions,
      "WriteStrategyFlow"
    ),
};

export const useApi = {
  ...publicApi,
  ...userApi,
};
