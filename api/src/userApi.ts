// TODO api types from models to api
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

import { Service } from "./service.js"

export const userApiActionTypes = [
	"CopyStrategy",
	"CreateBinanceApiConfig",
	"CreatePurchaseOrder",
	"CreateStrategy",
	"DeleteAccount",
	"DeleteBinanceApiConfig",
	"DeleteStrategy",
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
	createPurchaseOrder: CreatePurchaseOrder
	createStrategy: CreateStrategy
	deleteAccount: DeleteAccount
	deleteBinanceApiConfig: DeleteBinanceApiConfig
	deleteStrategy: DeleteStrategy
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
