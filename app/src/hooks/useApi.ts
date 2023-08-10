import { PublicApiActionType, UserApiActionType } from "@ggbot2/api";
import { ReadBinanceApiKeyPermissions } from "@ggbot2/database";
import {
  AccountKey,
  CopyStrategy,
  CreateBinanceApiConfig,
  CreateStrategy,
  DeleteAccount,
  DeleteBinanceApiConfig,
  DeleteStrategy,
  ReadAccount,
  ReadAccountStrategies,
  ReadBinanceApiKey,
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
import { EmptyObject } from "type-fest";

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

type Authenticated<Operation extends (...args: any[]) => Promise<unknown>> =
  Omit<Parameters<Operation>[0], "accountId"> extends EmptyObject
    ? (arg: void) => Promise<Awaited<ReturnType<Operation>>>
    : Parameters<Operation>[0] extends AccountKey
    ? (
        arg: Omit<Parameters<Operation>[0], "accountId">
      ) => Promise<Awaited<ReturnType<Operation>>>
    : never;

const userApi = {
  CopyStrategy: () =>
    useAction<Authenticated<CopyStrategy>, UserApiActionType>(
      userApiOptions,
      "CopyStrategy"
    ),
  CreateBinanceApiConfig: () =>
    useAction<Authenticated<CreateBinanceApiConfig>, UserApiActionType>(
      userApiOptions,
      "CreateBinanceApiConfig"
    ),
  CreateStrategy: () =>
    useAction<Authenticated<CreateStrategy>, UserApiActionType>(
      userApiOptions,
      "CreateStrategy"
    ),
  DeleteAccount: () =>
    useAction<Authenticated<DeleteAccount>, UserApiActionType>(
      userApiOptions,
      "DeleteAccount"
    ),
  DeleteBinanceApiConfig: () =>
    useAction<Authenticated<DeleteBinanceApiConfig>, UserApiActionType>(
      userApiOptions,
      "DeleteBinanceApiConfig"
    ),
  DeleteStrategy: () =>
    useAction<Authenticated<DeleteStrategy>, UserApiActionType>(
      userApiOptions,
      "DeleteStrategy"
    ),
  ReadAccount: () =>
    useAction<Authenticated<ReadAccount>, UserApiActionType>(
      userApiOptions,
      "ReadAccount"
    ),
  ReadAccountStrategies: () =>
    useAction<Authenticated<ReadAccountStrategies>, UserApiActionType>(
      userApiOptions,
      "ReadAccountStrategies"
    ),
  ReadBinanceApiKey: () =>
    useAction<Authenticated<ReadBinanceApiKey>, UserApiActionType>(
      userApiOptions,
      "ReadBinanceApiKey"
    ),
  ReadBinanceApiKeyPermissions: () =>
    useAction<Authenticated<ReadBinanceApiKeyPermissions>, UserApiActionType>(
      userApiOptions,
      "ReadBinanceApiKeyPermissions"
    ),
  ReadStrategyBalances: () =>
    useAction<Authenticated<ReadStrategyBalances>, UserApiActionType>(
      userApiOptions,
      "ReadStrategyBalances"
    ),
  ReadStrategyOrders: () =>
    useAction<Authenticated<ReadStrategyOrders>, UserApiActionType>(
      userApiOptions,
      "ReadStrategyOrders"
    ),
  ReadSubscription: () =>
    useAction<Authenticated<ReadSubscription>, UserApiActionType>(
      userApiOptions,
      "ReadSubscription"
    ),
  RenameAccount: () =>
    useAction<Authenticated<RenameAccount>, UserApiActionType>(
      userApiOptions,
      "RenameAccount"
    ),
  RenameStrategy: () =>
    useAction<Authenticated<RenameStrategy>, UserApiActionType>(
      userApiOptions,
      "RenameStrategy"
    ),
  SetAccountCountry: () =>
    useAction<Authenticated<SetAccountCountry>, UserApiActionType>(
      userApiOptions,
      "SetAccountCountry"
    ),
  WriteAccountStrategiesItemSchedulings: () =>
    useAction<
      Authenticated<WriteAccountStrategiesItemSchedulings>,
      UserApiActionType
    >(userApiOptions, "WriteAccountStrategiesItemSchedulings"),
  WriteStrategyFlow: () =>
    useAction<Authenticated<WriteStrategyFlow>, UserApiActionType>(
      userApiOptions,
      "WriteStrategyFlow"
    ),
};

export const useApi = {
  ...publicApi,
  ...userApi,
};
