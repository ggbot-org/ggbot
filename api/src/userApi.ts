// TODO api types from models to api
import {
	AccountKey,
	BinanceApiConfig,
	BinanceApiKeyPermissionCriteria,
	CopyStrategy,
	CreatePurchaseOrder,
	CreateStrategy,
	CreationTime,
	DeleteAccount,
	DeleteStrategy,
	DeletionTime,
	isAccountKey,
	isBinanceApiConfig,
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
import { objectTypeGuard } from "minimal-type-guard-helpers"

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

type CreateBinanceApiConfigInput = AccountKey & BinanceApiConfig

export const isCreateBinanceApiConfigInput =
	objectTypeGuard<CreateBinanceApiConfigInput>(
		({ apiKey, apiSecret, ...accountKey }) =>
			isAccountKey(accountKey) &&
			isBinanceApiConfig({ apiKey, apiSecret })
	)

export type CreateBinanceApiConfig = (
	arg: CreateBinanceApiConfigInput
) => Promise<CreationTime>

export type DeleteBinanceApiConfig = (arg: AccountKey) => Promise<DeletionTime>

export type ReadBinanceApiConfig = (
	arg: AccountKey
) => Promise<BinanceApiConfig | null>

// On client-side, the `apiSecret` is omitted.
export type ReadBinanceApiKey = (
	arg: AccountKey
) => Promise<Pick<BinanceApiConfig, "apiKey"> | null>

export type ReadBinanceApiKeyPermissions = (
	arg: AccountKey
) => Promise<BinanceApiKeyPermissionCriteria>

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
