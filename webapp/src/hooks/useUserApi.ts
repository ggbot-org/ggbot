import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	OmitAccountKey,
	UserApiAction as Action,
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
		useAction<Action["CopyStrategy"], ActionType>(
			apiOptions,
			"CopyStrategy"
		),
	CreateBinanceApiConfig: () =>
		useAction<Action["CreateBinanceApiConfig"], ActionType>(
			apiOptions,
			"CreateBinanceApiConfig"
		),
	CreatePurchaseOrder: () =>
		useAction<OmitAccountKey<CreatePurchaseOrder>, ActionType>(
			apiOptions,
			"CreatePurchaseOrder"
		),
	CreateStrategy: () =>
		useAction<Action["CreateStrategy"], ActionType>(
			apiOptions,
			"CreateStrategy"
		),
	DeleteAccount: () =>
		useAction<OmitAccountKey<DeleteAccount>, ActionType>(
			apiOptions,
			"DeleteAccount"
		),
	DeleteBinanceApiConfig: () =>
		useAction<Action["DeleteBinanceApiConfig"], ActionType>(
			apiOptions,
			"DeleteBinanceApiConfig"
		),
	DeleteStrategy: () =>
		useAction<Action["DeleteStrategy"], ActionType>(
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
		useAction<Action["ReadBinanceApiKey"], ActionType>(
			apiOptions,
			"ReadBinanceApiKey"
		),
	ReadBinanceApiKeyPermissions: () =>
		useAction<Action["ReadBinanceApiKeyPermissions"], ActionType>(
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
