/* eslint sort-keys: "error" */
import { UserApiAction as ApiAction, UserApiActionType as ApiActionType } from "@ggbot2/api";
import { useAction } from "@ggbot2/use-action";

export const useApi = {
  CopyStrategy: () =>
    useAction<ApiAction["CopyStrategy"], ApiActionType>({
      type: "CopyStrategy",
    }),
  CreateBinanceApiConfig: () =>
    useAction<ApiAction["CreateBinanceApiConfig"], ApiActionType>({
      type: "CreateBinanceApiConfig",
    }),
  CreateStrategy: () =>
    useAction<ApiAction["CreateStrategy"], ApiActionType>({
      type: "CreateStrategy",
    }),
  DeleteAccount: () =>
    useAction<ApiAction["DeleteAccount"], ApiActionType>({
      type: "DeleteAccount",
    }),
  DeleteBinanceApiConfig: () =>
    useAction<ApiAction["DeleteBinanceApiConfig"], ApiActionType>({
      type: "DeleteBinanceApiConfig",
    }),
  DeleteStrategy: () =>
    useAction<ApiAction["DeleteStrategy"], ApiActionType>({
      type: "DeleteStrategy",
    }),
  ExecuteStrategy: () =>
    useAction<ApiAction["ExecuteStrategy"], ApiActionType>({
      type: "ExecuteStrategy",
    }),
  ReadAccount: () =>
    useAction<ApiAction["ReadAccount"], ApiActionType>({ type: "ReadAccount" }),
  ReadAccountStrategies: () =>
    useAction<ApiAction["ReadAccountStrategies"], ApiActionType>({
      type: "ReadAccountStrategies",
    }),
  ReadBinanceApiConfig: () =>
    useAction<ApiAction["ReadBinanceApiConfig"], ApiActionType>({
      type: "ReadBinanceApiConfig",
    }),
  ReadBinanceApiKeyPermissions: () =>
    useAction<ApiAction["ReadBinanceApiKeyPermissions"], ApiActionType>({
      type: "ReadBinanceApiKeyPermissions",
    }),
  ReadStrategy: () =>
    useAction<ApiAction["ReadStrategy"], ApiActionType>({
      type: "ReadStrategy",
    }),
  ReadStrategyBalances: () =>
    useAction<ApiAction["ReadStrategyBalances"], ApiActionType>({
      type: "ReadStrategyBalances",
    }),
  ReadStrategyFlow: () =>
    useAction<ApiAction["ReadStrategyFlow"], ApiActionType>({
      type: "ReadStrategyFlow",
    }),
  ReadStrategyOrders: () =>
    useAction<ApiAction["ReadStrategyOrders"], ApiActionType>({
      type: "ReadStrategyOrders",
    }),
  ReadSubscription: () =>
    useAction<ApiAction["ReadSubscription"], ApiActionType>({
      type: "ReadSubscription",
    }),
  RenameAccount: () =>
    useAction<ApiAction["RenameAccount"], ApiActionType>({
      type: "RenameAccount",
    }),
  RenameStrategy: () =>
    useAction<ApiAction["RenameStrategy"], ApiActionType>({
      type: "RenameStrategy",
    }),
  SetAccountCountry: () =>
    useAction<ApiAction["SetAccountCountry"], ApiActionType>({
      type: "SetAccountCountry",
    }),
  WriteAccountStrategiesItemSchedulings: () =>
    useAction<
      ApiAction["WriteAccountStrategiesItemSchedulings"],
      ApiActionType
    >({
      type: "WriteAccountStrategiesItemSchedulings",
    }),
  WriteStrategyFlow: () =>
    useAction<ApiAction["WriteStrategyFlow"], ApiActionType>({
      type: "WriteStrategyFlow",
    }),
};
