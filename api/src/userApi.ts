import {
	CopyStrategy,
	CreateBinanceApiConfig,
	CreateStrategy,
	DeleteAccount,
	DeleteBinanceApiConfig,
	DeleteStrategy,
	ReadAccount,
	ReadAccountInfo,
	ReadAccountStrategies,
	ReadBinanceApiKey,
	ReadBinanceApiKeyPermissions,
	ReadStrategyBalances,
	ReadStrategyOrders,
	ReadSubscription,
	RenameAccount,
	RenameStrategy,
	Service,
	SetAccountCountry,
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
	"ReadAccountInfo",
	"ReadAccountStrategies",
	"ReadBinanceApiKey",
	"ReadBinanceApiKeyPermissions",
	"ReadStrategyBalances",
	"ReadStrategyOrders",
	"ReadSubscription",
	"RenameAccount",
	"RenameStrategy",
	"SetAccountCountry",
	"WriteAccountStrategiesItemSchedulings",
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
	readAccountInfo: ReadAccountInfo
	readAccountStrategies: ReadAccountStrategies
	readBinanceApiKey: ReadBinanceApiKey
	readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions
	readStrategyBalances: ReadStrategyBalances
	readStrategyOrders: ReadStrategyOrders
	readSubscription: ReadSubscription
	renameAccount: RenameAccount
	renameStrategy: RenameStrategy
	setAccountCountry: SetAccountCountry
	writeAccountStrategiesItemSchedulings: WriteAccountStrategiesItemSchedulings
	writeStrategyFlow: WriteStrategyFlow
}

export type UserApiService = Service<UserApiActionType, UserApiDataProvider>
