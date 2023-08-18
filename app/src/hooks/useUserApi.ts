import { UserApiActionType } from "@ggbot2/api"
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
	ReadBinanceApiKeyPermissions,
	ReadStrategyBalances,
	ReadStrategyOrders,
	ReadSubscription,
	RenameAccount,
	RenameStrategy,
	SetAccountCountry,
	WriteAccountStrategiesItemSchedulings,
	WriteStrategyFlow
} from "@ggbot2/models"
import { useAction } from "@ggbot2/use-action"
import { EmptyObject } from "type-fest"

import { url } from "../routing/URLs.js"

const apiOptions = { endpoint: url.apiUserAction, withJwt: true }

type Authenticated<Operation extends (...args: any[]) => Promise<unknown>> =
	Omit<Parameters<Operation>[0], "accountId"> extends EmptyObject
		? (arg: void) => Promise<Awaited<ReturnType<Operation>>>
		: Parameters<Operation>[0] extends AccountKey
		? (
				arg: Omit<Parameters<Operation>[0], "accountId">
		  ) => Promise<Awaited<ReturnType<Operation>>>
		: never

export const useUserApi = {
	CopyStrategy: () =>
		useAction<Authenticated<CopyStrategy>, UserApiActionType>(
			apiOptions,
			"CopyStrategy"
		),
	CreateBinanceApiConfig: () =>
		useAction<Authenticated<CreateBinanceApiConfig>, UserApiActionType>(
			apiOptions,
			"CreateBinanceApiConfig"
		),
	CreateStrategy: () =>
		useAction<Authenticated<CreateStrategy>, UserApiActionType>(
			apiOptions,
			"CreateStrategy"
		),
	DeleteAccount: () =>
		useAction<Authenticated<DeleteAccount>, UserApiActionType>(
			apiOptions,
			"DeleteAccount"
		),
	DeleteBinanceApiConfig: () =>
		useAction<Authenticated<DeleteBinanceApiConfig>, UserApiActionType>(
			apiOptions,
			"DeleteBinanceApiConfig"
		),
	DeleteStrategy: () =>
		useAction<Authenticated<DeleteStrategy>, UserApiActionType>(
			apiOptions,
			"DeleteStrategy"
		),
	ReadAccount: () =>
		useAction<Authenticated<ReadAccount>, UserApiActionType>(
			apiOptions,
			"ReadAccount"
		),
	ReadAccountStrategies: () =>
		useAction<Authenticated<ReadAccountStrategies>, UserApiActionType>(
			apiOptions,
			"ReadAccountStrategies"
		),
	ReadBinanceApiKey: () =>
		useAction<Authenticated<ReadBinanceApiKey>, UserApiActionType>(
			apiOptions,
			"ReadBinanceApiKey"
		),
	ReadBinanceApiKeyPermissions: () =>
		useAction<
			Authenticated<ReadBinanceApiKeyPermissions>,
			UserApiActionType
		>(apiOptions, "ReadBinanceApiKeyPermissions"),
	ReadStrategyBalances: () =>
		useAction<Authenticated<ReadStrategyBalances>, UserApiActionType>(
			apiOptions,
			"ReadStrategyBalances"
		),
	ReadStrategyOrders: () =>
		useAction<Authenticated<ReadStrategyOrders>, UserApiActionType>(
			apiOptions,
			"ReadStrategyOrders"
		),
	ReadSubscription: () =>
		useAction<Authenticated<ReadSubscription>, UserApiActionType>(
			apiOptions,
			"ReadSubscription"
		),
	RenameAccount: () =>
		useAction<Authenticated<RenameAccount>, UserApiActionType>(
			apiOptions,
			"RenameAccount"
		),
	RenameStrategy: () =>
		useAction<Authenticated<RenameStrategy>, UserApiActionType>(
			apiOptions,
			"RenameStrategy"
		),
	SetAccountCountry: () =>
		useAction<Authenticated<SetAccountCountry>, UserApiActionType>(
			apiOptions,
			"SetAccountCountry"
		),
	WriteAccountStrategiesItemSchedulings: () =>
		useAction<
			Authenticated<WriteAccountStrategiesItemSchedulings>,
			UserApiActionType
		>(apiOptions, "WriteAccountStrategiesItemSchedulings"),
	WriteStrategyFlow: () =>
		useAction<Authenticated<WriteStrategyFlow>, UserApiActionType>(
			apiOptions,
			"WriteStrategyFlow"
		)
}
