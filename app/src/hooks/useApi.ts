/* eslint sort-keys: "error" */
import {
  PublicApiAction,
  PublicApiActionType,
  UserApiAction,
  UserApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const endpoint = url.apiUserAction;

export const useApi = {
  CopyStrategy: () =>
    useAction<UserApiAction["CopyStrategy"], UserApiActionType>(endpoint, {
      type: "CopyStrategy",
    }),
  CreateBinanceApiConfig: () =>
    useAction<UserApiAction["CreateBinanceApiConfig"], UserApiActionType>(
      endpoint,
      {
        type: "CreateBinanceApiConfig",
      }
    ),
  CreateStrategy: () =>
    useAction<UserApiAction["CreateStrategy"], UserApiActionType>(endpoint, {
      type: "CreateStrategy",
    }),
  DeleteAccount: () =>
    useAction<UserApiAction["DeleteAccount"], UserApiActionType>(endpoint, {
      type: "DeleteAccount",
    }),
  DeleteBinanceApiConfig: () =>
    useAction<UserApiAction["DeleteBinanceApiConfig"], UserApiActionType>(
      endpoint,
      {
        type: "DeleteBinanceApiConfig",
      }
    ),
  DeleteStrategy: () =>
    useAction<UserApiAction["DeleteStrategy"], UserApiActionType>(endpoint, {
      type: "DeleteStrategy",
    }),
  ExecuteStrategy: () =>
    useAction<UserApiAction["ExecuteStrategy"], UserApiActionType>(endpoint, {
      type: "ExecuteStrategy",
    }),
  ReadAccount: () =>
    useAction<UserApiAction["ReadAccount"], UserApiActionType>(endpoint, {
      type: "ReadAccount",
    }),
  ReadAccountStrategies: () =>
    useAction<UserApiAction["ReadAccountStrategies"], UserApiActionType>(
      endpoint,
      {
        type: "ReadAccountStrategies",
      }
    ),
  ReadBinanceApiConfig: () =>
    useAction<UserApiAction["ReadBinanceApiConfig"], UserApiActionType>(
      endpoint,
      {
        type: "ReadBinanceApiConfig",
      }
    ),
  ReadBinanceApiKeyPermissions: () =>
    useAction<UserApiAction["ReadBinanceApiKeyPermissions"], UserApiActionType>(
      endpoint,
      {
        type: "ReadBinanceApiKeyPermissions",
      }
    ),
  ReadStrategy: () =>
    useAction<PublicApiAction["ReadStrategy"], PublicApiActionType>(endpoint, {
      type: "ReadStrategy",
    }),
  ReadStrategyBalances: () =>
    useAction<UserApiAction["ReadStrategyBalances"], UserApiActionType>(
      endpoint,
      {
        type: "ReadStrategyBalances",
      }
    ),
  ReadStrategyFlow: () =>
    useAction<PublicApiAction["ReadStrategyFlow"], PublicApiActionType>(
      endpoint,
      {
        type: "ReadStrategyFlow",
      }
    ),
  ReadStrategyOrders: () =>
    useAction<UserApiAction["ReadStrategyOrders"], UserApiActionType>(
      endpoint,
      {
        type: "ReadStrategyOrders",
      }
    ),
  ReadSubscription: () =>
    useAction<UserApiAction["ReadSubscription"], UserApiActionType>(endpoint, {
      type: "ReadSubscription",
    }),
  RenameAccount: () =>
    useAction<UserApiAction["RenameAccount"], UserApiActionType>(endpoint, {
      type: "RenameAccount",
    }),
  RenameStrategy: () =>
    useAction<UserApiAction["RenameStrategy"], UserApiActionType>(endpoint, {
      type: "RenameStrategy",
    }),
  SetAccountCountry: () =>
    useAction<UserApiAction["SetAccountCountry"], UserApiActionType>(endpoint, {
      type: "SetAccountCountry",
    }),
  WriteAccountStrategiesItemSchedulings: () =>
    useAction<
      UserApiAction["WriteAccountStrategiesItemSchedulings"],
      UserApiActionType
    >(endpoint, {
      type: "WriteAccountStrategiesItemSchedulings",
    }),
  WriteStrategyFlow: () =>
    useAction<UserApiAction["WriteStrategyFlow"], UserApiActionType>(endpoint, {
      type: "WriteStrategyFlow",
    }),
};
