/* eslint sort-keys: "error" */
import {
  PublicApiAction,
  PublicApiActionType,
  UserApiAction,
  UserApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const userEndpoint = url.apiUserAction;
const publicEndpoint = url.apiPublicAction;

const publicApi = {
  ReadStrategy: () =>
    useAction<PublicApiAction["ReadStrategy"], PublicApiActionType>(
      publicEndpoint,
      {
        type: "ReadStrategy",
      }
    ),
  ReadStrategyFlow: () =>
    useAction<PublicApiAction["ReadStrategyFlow"], PublicApiActionType>(
      publicEndpoint,
      {
        type: "ReadStrategyFlow",
      }
    ),
};

const userApi = {
  CopyStrategy: () =>
    useAction<UserApiAction["CopyStrategy"], UserApiActionType>(userEndpoint, {
      type: "CopyStrategy",
    }),
  CreateBinanceApiConfig: () =>
    useAction<UserApiAction["CreateBinanceApiConfig"], UserApiActionType>(
      userEndpoint,
      {
        type: "CreateBinanceApiConfig",
      }
    ),
  CreateStrategy: () =>
    useAction<UserApiAction["CreateStrategy"], UserApiActionType>(
      userEndpoint,
      {
        type: "CreateStrategy",
      }
    ),
  DeleteAccount: () =>
    useAction<UserApiAction["DeleteAccount"], UserApiActionType>(userEndpoint, {
      type: "DeleteAccount",
    }),
  DeleteBinanceApiConfig: () =>
    useAction<UserApiAction["DeleteBinanceApiConfig"], UserApiActionType>(
      userEndpoint,
      {
        type: "DeleteBinanceApiConfig",
      }
    ),
  DeleteStrategy: () =>
    useAction<UserApiAction["DeleteStrategy"], UserApiActionType>(
      userEndpoint,
      {
        type: "DeleteStrategy",
      }
    ),
  ExecuteStrategy: () =>
    useAction<UserApiAction["ExecuteStrategy"], UserApiActionType>(
      userEndpoint,
      {
        type: "ExecuteStrategy",
      }
    ),
  ReadAccount: () =>
    useAction<UserApiAction["ReadAccount"], UserApiActionType>(userEndpoint, {
      type: "ReadAccount",
    }),
  ReadAccountStrategies: () =>
    useAction<UserApiAction["ReadAccountStrategies"], UserApiActionType>(
      userEndpoint,
      {
        type: "ReadAccountStrategies",
      }
    ),
  ReadBinanceApiConfig: () =>
    useAction<UserApiAction["ReadBinanceApiConfig"], UserApiActionType>(
      userEndpoint,
      {
        type: "ReadBinanceApiConfig",
      }
    ),
  ReadBinanceApiKeyPermissions: () =>
    useAction<UserApiAction["ReadBinanceApiKeyPermissions"], UserApiActionType>(
      userEndpoint,
      {
        type: "ReadBinanceApiKeyPermissions",
      }
    ),
  ReadStrategyBalances: () =>
    useAction<UserApiAction["ReadStrategyBalances"], UserApiActionType>(
      userEndpoint,
      {
        type: "ReadStrategyBalances",
      }
    ),
  ReadStrategyOrders: () =>
    useAction<UserApiAction["ReadStrategyOrders"], UserApiActionType>(
      userEndpoint,
      {
        type: "ReadStrategyOrders",
      }
    ),
  ReadSubscription: () =>
    useAction<UserApiAction["ReadSubscription"], UserApiActionType>(
      userEndpoint,
      {
        type: "ReadSubscription",
      }
    ),
  RenameAccount: () =>
    useAction<UserApiAction["RenameAccount"], UserApiActionType>(userEndpoint, {
      type: "RenameAccount",
    }),
  RenameStrategy: () =>
    useAction<UserApiAction["RenameStrategy"], UserApiActionType>(
      userEndpoint,
      {
        type: "RenameStrategy",
      }
    ),
  SetAccountCountry: () =>
    useAction<UserApiAction["SetAccountCountry"], UserApiActionType>(
      userEndpoint,
      {
        type: "SetAccountCountry",
      }
    ),
  WriteAccountStrategiesItemSchedulings: () =>
    useAction<
      UserApiAction["WriteAccountStrategiesItemSchedulings"],
      UserApiActionType
    >(userEndpoint, {
      type: "WriteAccountStrategiesItemSchedulings",
    }),
  WriteStrategyFlow: () =>
    useAction<UserApiAction["WriteStrategyFlow"], UserApiActionType>(
      userEndpoint,
      {
        type: "WriteStrategyFlow",
      }
    ),
};

export const useApi = {
  ...publicApi,
  ...userApi,
};
