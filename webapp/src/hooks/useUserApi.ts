import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	UserAction as Action,
	UserActionType as ActionType
} from "@workspace/api"

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
		useAction<Action["CreatePurchaseOrder"], ActionType>(
			apiOptions,
			"CreatePurchaseOrder"
		),
	CreateStrategy: () =>
		useAction<Action["CreateStrategy"], ActionType>(
			apiOptions,
			"CreateStrategy"
		),
	DeleteAccount: () =>
		useAction<Action["DeleteAccount"], ActionType>(
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
		useAction<Action["ReadAccountInfo"], ActionType>(
			apiOptions,
			"ReadAccountInfo"
		),
	ReadAccountStrategies: () =>
		useAction<Action["ReadAccountStrategies"], ActionType>(
			apiOptions,
			"ReadAccountStrategies"
		),
	ReadBinanceAccountApiRestrictions: () =>
		useAction<Action["ReadBinanceAccountApiRestrictions"], ActionType>(
			apiOptions,
			"ReadBinanceAccountApiRestrictions"
		),
	ReadBinanceApiKey: () =>
		useAction<Action["ReadBinanceApiKey"], ActionType>(
			apiOptions,
			"ReadBinanceApiKey"
		),
	// TODO
	// ReadStrategyBalances: () =>
	// 	useAction<Action['ReadStrategyBalances'], ActionType>(
	// 		apiOptions,
	// 		"ReadStrategyBalances"
	// 	),
	ReadStrategyOrders: () =>
		useAction<Action["ReadStrategyOrders"], ActionType>(
			apiOptions,
			"ReadStrategyOrders"
		),
	ReadSubscription: () =>
		useAction<Action["ReadSubscription"], ActionType>(
			apiOptions,
			"ReadSubscription"
		),
	RenameAccount: () =>
		useAction<Action["RenameAccount"], ActionType>(
			apiOptions,
			"RenameAccount"
		),
	RenameStrategy: () =>
		useAction<Action["RenameStrategy"], ActionType>(
			apiOptions,
			"RenameStrategy"
		),
	SetAccountCountry: () =>
		useAction<Action["SetAccountCountry"], ActionType>(
			apiOptions,
			"SetAccountCountry"
		),
	WriteAccountStrategiesItemSchedulings: () =>
		useAction<Action["WriteAccountStrategiesItemSchedulings"], ActionType>(
			apiOptions,
			"WriteAccountStrategiesItemSchedulings"
		),
	WriteStrategyFlow: () =>
		useAction<Action["WriteStrategyFlow"], ActionType>(
			apiOptions,
			"WriteStrategyFlow"
		)
}
