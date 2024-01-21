import { Authenticated, useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import { UserApiActionType } from "@workspace/api"
import {
	CopyStrategy,
	CreateBinanceApiConfig,
	CreatePurchaseOrder,
	CreateStrategy,
	DeleteAccount,
	DeleteBinanceApiConfig,
	DeleteStrategy,
	ReadAccountInfo,
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

const apiOptions: UseActionApiArg = {
	endpoint: api.user.action.href,
	withAuth: true
}

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
	CreatePurchaseOrder: () =>
		useAction<Authenticated<CreatePurchaseOrder>, UserApiActionType>(
			apiOptions,
			"CreatePurchaseOrder"
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
	ReadAccountInfo: () =>
		useAction<Authenticated<ReadAccountInfo>, UserApiActionType>(
			apiOptions,
			"ReadAccountInfo"
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
