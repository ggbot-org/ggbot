import {
  PublicApiAction,
  PublicApiActionType,
  UserApiAction,
  UserApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const publicApiOptions = { endpoint: url.apiPublicAction };
const userApiOptions = { endpoint: url.apiUserAction, withJwt: true };

const publicApi = {
  ReadStrategy: () =>
    useAction<PublicApiAction["ReadStrategy"], PublicApiActionType>(
      publicApiOptions,
      {
        type: "ReadStrategy",
      }
    ),
  ReadStrategyFlow: () =>
    useAction<PublicApiAction["ReadStrategyFlow"], PublicApiActionType>(
      publicApiOptions,
      {
        type: "ReadStrategyFlow",
      }
    ),
};

const userApi = {
  CopyStrategy: () =>
    useAction<UserApiAction["CopyStrategy"], UserApiActionType>(
      userApiOptions,
      {
        type: "CopyStrategy",
      }
    ),
  CreateBinanceApiConfig: () =>
    useAction<UserApiAction["CreateBinanceApiConfig"], UserApiActionType>(
      userApiOptions,
      {
        type: "CreateBinanceApiConfig",
      }
    ),
  CreateStrategy: () =>
    useAction<UserApiAction["CreateStrategy"], UserApiActionType>(
      userApiOptions,
      {
        type: "CreateStrategy",
      }
    ),
  DeleteAccount: () =>
    useAction<UserApiAction["DeleteAccount"], UserApiActionType>(
      userApiOptions,
      {
        type: "DeleteAccount",
      }
    ),
  DeleteBinanceApiConfig: () =>
    useAction<UserApiAction["DeleteBinanceApiConfig"], UserApiActionType>(
      userApiOptions,
      {
        type: "DeleteBinanceApiConfig",
      }
    ),
  DeleteStrategy: () =>
    useAction<UserApiAction["DeleteStrategy"], UserApiActionType>(
      userApiOptions,
      {
        type: "DeleteStrategy",
      }
    ),
  ExecuteStrategy: () =>
    useAction<UserApiAction["ExecuteStrategy"], UserApiActionType>(
      userApiOptions,
      {
        type: "ExecuteStrategy",
      }
    ),
  ReadAccount: () =>
    useAction<UserApiAction["ReadAccount"], UserApiActionType>(userApiOptions, {
      type: "ReadAccount",
    }),
  ReadAccountStrategies: () =>
    useAction<UserApiAction["ReadAccountStrategies"], UserApiActionType>(
      userApiOptions,
      {
        type: "ReadAccountStrategies",
      }
    ),
  ReadBinanceApiConfig: () =>
    useAction<UserApiAction["ReadBinanceApiConfig"], UserApiActionType>(
      userApiOptions,
      {
        type: "ReadBinanceApiConfig",
      }
    ),
  ReadBinanceApiKeyPermissions: () =>
    useAction<UserApiAction["ReadBinanceApiKeyPermissions"], UserApiActionType>(
      userApiOptions,
      {
        type: "ReadBinanceApiKeyPermissions",
      }
    ),
  ReadStrategyBalances: () =>
    useAction<UserApiAction["ReadStrategyBalances"], UserApiActionType>(
      userApiOptions,
      {
        type: "ReadStrategyBalances",
      }
    ),
  ReadStrategyOrders: () =>
    useAction<UserApiAction["ReadStrategyOrders"], UserApiActionType>(
      userApiOptions,
      {
        type: "ReadStrategyOrders",
      }
    ),
  ReadSubscription: () =>
    useAction<UserApiAction["ReadSubscription"], UserApiActionType>(
      userApiOptions,
      {
        type: "ReadSubscription",
      }
    ),
  RenameAccount: () =>
    useAction<UserApiAction["RenameAccount"], UserApiActionType>(
      userApiOptions,
      {
        type: "RenameAccount",
      }
    ),
  RenameStrategy: () =>
    useAction<UserApiAction["RenameStrategy"], UserApiActionType>(
      userApiOptions,
      {
        type: "RenameStrategy",
      }
    ),
  SetAccountCountry: () =>
    useAction<UserApiAction["SetAccountCountry"], UserApiActionType>(
      userApiOptions,
      {
        type: "SetAccountCountry",
      }
    ),
  WriteAccountStrategiesItemSchedulings: () =>
    useAction<
      UserApiAction["WriteAccountStrategiesItemSchedulings"],
      UserApiActionType
    >(userApiOptions, {
      type: "WriteAccountStrategiesItemSchedulings",
    }),
  WriteStrategyFlow: () =>
    useAction<UserApiAction["WriteStrategyFlow"], UserApiActionType>(
      userApiOptions,
      {
        type: "WriteStrategyFlow",
      }
    ),
};

export const useApi = {
  ...publicApi,
  ...userApi,
};
