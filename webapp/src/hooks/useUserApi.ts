import { Authenticated, useAction } from "_/hooks/useAction"
import { url } from "_/routing/user/URLs"
import { UserApiActionType } from "@workspace/api"
import {
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
} from "@workspace/models"

const apiOptions = { endpoint: url.apiUserAction, withJwt: true }

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
	ReadStrategies: () =>
		useAction<Authenticated<ReadAccountStrategies>, UserApiActionType>(
			apiOptions,
			"ReadStrategies"
		),
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
