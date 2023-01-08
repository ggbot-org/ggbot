import { useAction } from "@ggbot2/api-action";
import type { ApiAction, ApiActionType } from "_api/action";

export const useApiAction = {
  CopyStrategy: () =>
    useAction<ApiAction["CopyStrategy"], ApiActionType>({
      type: "CopyStrategy",
    }),
  CreateAccountStrategiesItemScheduling: () =>
    useAction<
      ApiAction["CreateAccountStrategiesItemScheduling"],
      ApiActionType
    >({
      type: "CreateAccountStrategiesItemScheduling",
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
  ReadStrategyOrders: () =>
    useAction<ApiAction["ReadStrategyOrders"], ApiActionType>({
      type: "ReadStrategyOrders",
    }),
  ReadStrategyFlow: () =>
    useAction<ApiAction["ReadStrategyFlow"], ApiActionType>({
      type: "ReadStrategyFlow",
    }),
  ReadSubscription: () =>
    useAction<ApiAction["ReadSubscription"], ApiActionType>({
      type: "ReadSubscription",
    }),
  RemoveAccountStrategiesItemSchedulings: () =>
    useAction<
      ApiAction["RemoveAccountStrategiesItemSchedulings"],
      ApiActionType
    >({
      type: "RemoveAccountStrategiesItemSchedulings",
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
  WriteStrategyFlow: () =>
    useAction<ApiAction["WriteStrategyFlow"], ApiActionType>({
      type: "WriteStrategyFlow",
    }),
};
