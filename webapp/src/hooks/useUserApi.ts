import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	CopyStrategy,
	CreateBinanceApiConfig,
	CreateStrategy,
	DeleteBinanceApiConfig,
	DeleteStrategy,
	OmitAccountKey,
	ReadBinanceApiKey,
	ReadBinanceApiKeyPermissions,
	UserApiActionType as ActionType
} from "@workspace/api"
import {
	CreatePurchaseOrder,
	DeleteAccount,
	ReadAccountInfo,
	ReadAccountStrategies,
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
		useAction<OmitAccountKey<CopyStrategy>, ActionType>(
			apiOptions,
			"CopyStrategy"
		),
	CreateBinanceApiConfig: () =>
		useAction<OmitAccountKey<CreateBinanceApiConfig>, ActionType>(
			apiOptions,
			"CreateBinanceApiConfig"
		),
	CreatePurchaseOrder: () =>
		useAction<OmitAccountKey<CreatePurchaseOrder>, ActionType>(
			apiOptions,
			"CreatePurchaseOrder"
		),
	CreateStrategy: () =>
		useAction<OmitAccountKey<CreateStrategy>, ActionType>(
			apiOptions,
			"CreateStrategy"
		),
	DeleteAccount: () =>
		useAction<OmitAccountKey<DeleteAccount>, ActionType>(
			apiOptions,
			"DeleteAccount"
		),
	DeleteBinanceApiConfig: () =>
		useAction<OmitAccountKey<DeleteBinanceApiConfig>, ActionType>(
			apiOptions,
			"DeleteBinanceApiConfig"
		),
	DeleteStrategy: () =>
		useAction<OmitAccountKey<DeleteStrategy>, ActionType>(
			apiOptions,
			"DeleteStrategy"
		),
	ReadAccountInfo: () =>
		useAction<OmitAccountKey<ReadAccountInfo>, ActionType>(
			apiOptions,
			"ReadAccountInfo"
		),
	ReadAccountStrategies: () =>
		useAction<OmitAccountKey<ReadAccountStrategies>, ActionType>(
			apiOptions,
			"ReadAccountStrategies"
		),
	ReadBinanceApiKey: () =>
		useAction<OmitAccountKey<ReadBinanceApiKey>, ActionType>(
			apiOptions,
			"ReadBinanceApiKey"
		),
	ReadBinanceApiKeyPermissions: () =>
		useAction<OmitAccountKey<ReadBinanceApiKeyPermissions>, ActionType>(
			apiOptions,
			"ReadBinanceApiKeyPermissions"
		),
	ReadStrategyBalances: () =>
		useAction<OmitAccountKey<ReadStrategyBalances>, ActionType>(
			apiOptions,
			"ReadStrategyBalances"
		),
	ReadStrategyOrders: () =>
		useAction<OmitAccountKey<ReadStrategyOrders>, ActionType>(
			apiOptions,
			"ReadStrategyOrders"
		),
	ReadSubscription: () =>
		useAction<OmitAccountKey<ReadSubscription>, ActionType>(
			apiOptions,
			"ReadSubscription"
		),
	RenameAccount: () =>
		useAction<OmitAccountKey<RenameAccount>, ActionType>(
			apiOptions,
			"RenameAccount"
		),
	RenameStrategy: () =>
		useAction<OmitAccountKey<RenameStrategy>, ActionType>(
			apiOptions,
			"RenameStrategy"
		),
	SetAccountCountry: () =>
		useAction<OmitAccountKey<SetAccountCountry>, ActionType>(
			apiOptions,
			"SetAccountCountry"
		),
	WriteAccountStrategiesItemSchedulings: () =>
		useAction<
			OmitAccountKey<WriteAccountStrategiesItemSchedulings>,
			ActionType
		>(apiOptions, "WriteAccountStrategiesItemSchedulings"),
	WriteStrategyFlow: () =>
		useAction<OmitAccountKey<WriteStrategyFlow>, ActionType>(
			apiOptions,
			"WriteStrategyFlow"
		)
}
