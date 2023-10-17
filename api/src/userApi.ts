import {
	CopyStrategy,
	CreateBinanceApiConfig,
	CreateStrategy,
	DeleteAccount,
	DeleteBinanceApiConfig,
	DeleteStrategy,
	ReadAccount,
	ReadAccountStrategies,
	ReadStrategyOrders,
	ReadSubscription,
	RenameAccount,
	RenameStrategy,
	Service,
	WriteAccountStrategiesItemSchedulings,
	WriteStrategyFlow
} from "@workspace/models"

export const userApiActionTypes = [
	"CopyStrategy",
	"CreateBinanceApiConfig",
	"CreateStrategy",
	"DeleteAccount",
	"DeleteBinanceApiConfig",
	"DeleteStrategy",
	"ReadAccount",
	"ReadBinanceApiKey",
	"ReadBinanceApiKeyPermissions",
	"ReadStrategies",
	"ReadStrategyBalances",
	"ReadStrategyOrders",
	"ReadSubscription",
	"RenameAccount",
	"RenameStrategy",
	"SetAccountCountry",
	"WriteStrategiesItemSchedulings",
	"WriteStrategyFlow"
] as const
export type UserApiActionType = (typeof userApiActionTypes)[number]

export type UserApiDataProvider = {
	copyStrategy: CopyStrategy
	createBinanceApiConfig: CreateBinanceApiConfig
	createStrategy: CreateStrategy
	deleteAccount: DeleteAccount
	deleteBinanceApiConfig: DeleteBinanceApiConfig
	deleteStrategy: DeleteStrategy
	readAccount: ReadAccount
	readAccountStrategies: ReadAccountStrategies
	readStrategyOrders: ReadStrategyOrders
	readSubscription: ReadSubscription
	renameAccount: RenameAccount
	renameStrategy:RenameStrategy
	writeAccountStrategiesItemSchedulings: WriteAccountStrategiesItemSchedulings
	writeStrategyFlow: WriteStrategyFlow
}

export type UserApiService = Service<
	UserApiActionType,
	UserApiDataProvider
>
