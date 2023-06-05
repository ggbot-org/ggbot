/* eslint sort-keys: "error" */
import {
  UserApiAction as ApiAction,
  UserApiActionType as ApiActionType,
} from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

import { url } from "../routing/URLs.js";

const endpoint = url.apiUserAction;

export const useApi = {
  CopyStrategy: () =>
    useAction<ApiAction["CopyStrategy"], ApiActionType>(endpoint, {
      type: "CopyStrategy",
    }),
  CreateBinanceApiConfig: () =>
    useAction<ApiAction["CreateBinanceApiConfig"], ApiActionType>(endpoint, {
      type: "CreateBinanceApiConfig",
    }),
  CreateStrategy: () =>
    useAction<ApiAction["CreateStrategy"], ApiActionType>(endpoint, {
      type: "CreateStrategy",
    }),
  DeleteAccount: () =>
    useAction<ApiAction["DeleteAccount"], ApiActionType>(endpoint, {
      type: "DeleteAccount",
    }),
  DeleteBinanceApiConfig: () =>
    useAction<ApiAction["DeleteBinanceApiConfig"], ApiActionType>(endpoint, {
      type: "DeleteBinanceApiConfig",
    }),
  DeleteStrategy: () =>
    useAction<ApiAction["DeleteStrategy"], ApiActionType>(endpoint, {
      type: "DeleteStrategy",
    }),
  ExecuteStrategy: () =>
    useAction<ApiAction["ExecuteStrategy"], ApiActionType>(endpoint, {
      type: "ExecuteStrategy",
    }),
  ReadAccount: () =>
    useAction<ApiAction["ReadAccount"], ApiActionType>(endpoint, {
      type: "ReadAccount",
    }),
  ReadAccountStrategies: () =>
    useAction<ApiAction["ReadAccountStrategies"], ApiActionType>(endpoint, {
      type: "ReadAccountStrategies",
    }),
  ReadBinanceApiConfig: () =>
    useAction<ApiAction["ReadBinanceApiConfig"], ApiActionType>(endpoint, {
      type: "ReadBinanceApiConfig",
    }),
  ReadBinanceApiKeyPermissions: () =>
    useAction<ApiAction["ReadBinanceApiKeyPermissions"], ApiActionType>(
      endpoint,
      {
        type: "ReadBinanceApiKeyPermissions",
      }
    ),
  ReadStrategy: () =>
    useAction<ApiAction["ReadStrategy"], ApiActionType>(endpoint, {
      type: "ReadStrategy",
    }),
  ReadStrategyBalances: () =>
    useAction<ApiAction["ReadStrategyBalances"], ApiActionType>(endpoint, {
      type: "ReadStrategyBalances",
    }),
  ReadStrategyFlow: () =>
    useAction<ApiAction["ReadStrategyFlow"], ApiActionType>(endpoint, {
      type: "ReadStrategyFlow",
    }),
  ReadStrategyOrders: () =>
    useAction<ApiAction["ReadStrategyOrders"], ApiActionType>(endpoint, {
      type: "ReadStrategyOrders",
    }),
  ReadSubscription: () =>
    useAction<ApiAction["ReadSubscription"], ApiActionType>(endpoint, {
      type: "ReadSubscription",
    }),
  RenameAccount: () =>
    useAction<ApiAction["RenameAccount"], ApiActionType>(endpoint, {
      type: "RenameAccount",
    }),
  RenameStrategy: () =>
    useAction<ApiAction["RenameStrategy"], ApiActionType>(endpoint, {
      type: "RenameStrategy",
    }),
  SetAccountCountry: () =>
    useAction<ApiAction["SetAccountCountry"], ApiActionType>(endpoint, {
      type: "SetAccountCountry",
    }),
  WriteAccountStrategiesItemSchedulings: () =>
    useAction<
      ApiAction["WriteAccountStrategiesItemSchedulings"],
      ApiActionType
    >(endpoint, {
      type: "WriteAccountStrategiesItemSchedulings",
    }),
  WriteStrategyFlow: () =>
    useAction<ApiAction["WriteStrategyFlow"], ApiActionType>(endpoint, {
      type: "WriteStrategyFlow",
    }),
};
