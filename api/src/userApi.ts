import {
	AccountInfo,
	AccountKey,
	AccountStrategy,
	AccountStrategyItemKey,
	AccountStrategyKey,
	AllowedCountryIsoCode2,
	BinanceApiConfig,
	BinanceApiKeyPermissionCriteria,
	CreationTime,
	DeletionTime,
	EmailAddress,
	EmptyObject,
	isAccountKey,
	isAccountStrategyKey,
	isAllowedCountryIsoCode2,
	isBinanceApiConfig,
	isEmailAddress,
	isFlowViewSerializableGraph,
	isItemId,
	isName,
	isNaturalNumber,
	isPaymentProvider,
	isStrategy,
	isStrategySchedulings,
	isSubscriptionPlan,
	Name,
	NaturalNumber,
	NewItem,
	nullId,
	Order,
	PaymentProvider,
	Strategy,
	StrategyBalance,
	StrategyFlow,
	Subscription,
	SubscriptionPlan,
	UpdateTime
} from "@workspace/models"
import { DayInterval, isDayInterval } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { ApiOperation } from "./operation.js"
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

/**
 * Helper to infer user API operation.
 *
 * Notice that `accountId` is provided by authentication, so there is no need to
 * pass it as parameter.
 */
export type OmitAccountKey<Operation extends ApiOperation> = Omit<
	Parameters<Operation>[0],
	"accountId"
> extends EmptyObject
	? (arg: void) => Promise<Awaited<ReturnType<Operation>>>
	: Parameters<Operation>[0] extends AccountKey
	? (
			arg: Omit<Parameters<Operation>[0], "accountId">
	  ) => Promise<Awaited<ReturnType<Operation>>>
	: never

type Input = {
	CopyStrategy: AccountStrategyKey & Pick<Strategy, "name">
	CreateBinanceApiConfig: AccountKey & BinanceApiConfig
	CreatePurchaseOrder: AccountKey & {
		country: AllowedCountryIsoCode2
		email: EmailAddress
		numMonths: NaturalNumber
		paymentProvider: PaymentProvider
		plan: SubscriptionPlan
	}
	CreateStrategy: NewItem<Strategy>
	DeleteAccount: AccountKey
	DeleteBinanceApiConfig: AccountKey
	DeleteStrategy: AccountStrategyKey
	ReadAccountInfo: AccountKey
	ReadAccountStrategies: AccountKey
	ReadBinanceApiKey: AccountKey
	ReadBinanceApiKeyPermissions: AccountKey
	ReadStrategyBalances: AccountStrategyKey & DayInterval
	ReadStrategyOrders: AccountStrategyKey & DayInterval
	ReadSubscription: AccountKey
	RenameAccount: AccountKey & { name: Name }
	RenameStrategy: AccountStrategyKey & Pick<Strategy, "name">
	SetAccountCountry: AccountKey & { country: AllowedCountryIsoCode2 }
	// Need also `strategyKind` in order to write suggested frequency to strategy.
	WriteAccountStrategiesItemSchedulings: AccountStrategyItemKey &
		Pick<AccountStrategyKey, "strategyKind"> &
		Pick<AccountStrategy, "schedulings">
	WriteStrategyFlow: AccountStrategyKey & Omit<StrategyFlow, "whenUpdated">
}

type Operation = {
	CopyStrategy: (arg: Input["CopyStrategy"]) => Promise<Strategy>
	CreateBinanceApiConfig: (
		arg: Input["CreateBinanceApiConfig"]
	) => Promise<CreationTime>
	CreatePurchaseOrder: (arg: Input["CreatePurchaseOrder"]) => Promise<null>
	CreateStrategy: (arg: Input["CreateStrategy"]) => Promise<Strategy>
	DeleteAccount: (arg: Input["DeleteAccount"]) => Promise<DeletionTime>
	DeleteBinanceApiConfig: (
		arg: Input["DeleteBinanceApiConfig"]
	) => Promise<DeletionTime>
	DeleteStrategy: (arg: Input["DeleteStrategy"]) => Promise<DeletionTime>
	ReadAccountInfo: (
		arg: Input["ReadAccountInfo"]
	) => Promise<AccountInfo | null>
	ReadAccountStrategies: (
		arg: Input["ReadAccountStrategies"]
	) => Promise<AccountStrategy[]>
	ReadBinanceApiKey: (
		arg: Input["ReadBinanceApiKey"]
	) => Promise<Pick<BinanceApiConfig, "apiKey"> | null>
	ReadBinanceApiKeyPermissions: (
		arg: Input["ReadBinanceApiKeyPermissions"]
	) => Promise<BinanceApiKeyPermissionCriteria>
	ReadStrategyBalances: (
		arg: Input["ReadStrategyBalances"]
	) => Promise<StrategyBalance[]>
	ReadStrategyOrders: (arg: Input["ReadStrategyOrders"]) => Promise<Order[]>
	ReadSubscription: (
		arg: Input["ReadSubscription"]
	) => Promise<Subscription | null>
	RenameAccount: (arg: Input["RenameAccount"]) => Promise<UpdateTime>
	RenameStrategy: (arg: Input["RenameStrategy"]) => Promise<UpdateTime>
	SetAccountCountry: (arg: Input["SetAccountCountry"]) => Promise<UpdateTime>
	WriteAccountStrategiesItemSchedulings: (
		arg: Input["WriteAccountStrategiesItemSchedulings"]
	) => Promise<UpdateTime>
	WriteStrategyFlow: (arg: Input["WriteStrategyFlow"]) => Promise<UpdateTime>
}

export type UserApiDataProviderOperation = Operation

export type UserApiDataProvider = {
	copyStrategy: Operation["CopyStrategy"]
	createBinanceApiConfig: Operation["CreateBinanceApiConfig"]
	createPurchaseOrder: Operation["CreatePurchaseOrder"]
	createStrategy: Operation["CreateStrategy"]
	deleteAccount: Operation["DeleteAccount"]
	deleteBinanceApiConfig: Operation["DeleteBinanceApiConfig"]
	deleteStrategy: Operation["DeleteStrategy"]
	readAccountInfo: Operation["ReadAccountInfo"]
	readAccountStrategies: Operation["ReadAccountStrategies"]
	readBinanceApiKey: Operation["ReadBinanceApiKey"]
	readBinanceApiKeyPermissions: Operation["ReadBinanceApiKeyPermissions"]
	readStrategyBalances: Operation["ReadStrategyBalances"]
	readStrategyOrders: Operation["ReadStrategyOrders"]
	readSubscription: Operation["ReadSubscription"]
	renameAccount: Operation["RenameAccount"]
	renameStrategy: Operation["RenameStrategy"]
	setAccountCountry: Operation["SetAccountCountry"]
	writeAccountStrategiesItemSchedulings: Operation["WriteAccountStrategiesItemSchedulings"]
	writeStrategyFlow: Operation["WriteStrategyFlow"]
}

export type UserApiService = Service<UserApiActionType, UserApiDataProvider>

export const isUserApiDataProviderInput = {
	CopyStrategy: objectTypeGuard<Input["CopyStrategy"]>(
		({ name, ...accountStrategyKey }) =>
			isAccountStrategyKey(accountStrategyKey) && isName(name)
	),
	CreateBinanceApiConfig: objectTypeGuard<Input["CreateBinanceApiConfig"]>(
		({ apiKey, apiSecret, ...accountKey }) =>
			isAccountKey(accountKey) &&
			isBinanceApiConfig({ apiKey, apiSecret })
	),
	CreatePurchaseOrder: objectTypeGuard<Input["CreatePurchaseOrder"]>(
		({ country, email, numMonths, paymentProvider, plan, ...accountKey }) =>
			isAccountKey(accountKey) &&
			isEmailAddress(email) &&
			isSubscriptionPlan(plan) &&
			isAllowedCountryIsoCode2(country) &&
			isNaturalNumber(numMonths) &&
			isPaymentProvider(paymentProvider)
	),
	CreateStrategy: objectTypeGuard<Input["CreateStrategy"]>((arg) =>
		isStrategy({ ...arg, id: nullId, whenCreated: 1 })
	),
	DeleteAccount: isAccountKey,
	DeleteBinanceApiConfig: isAccountKey,
	DeleteStrategy: objectTypeGuard<Input["DeleteStrategy"]>(
		({ ...accountStrategyKey }) => isAccountStrategyKey(accountStrategyKey)
	),
	ReadAccountInfo: isAccountKey,
	ReadAccountStrategies: isAccountKey,
	ReadBinanceApiKey: isAccountKey,
	ReadBinanceApiKeyPermissions: isAccountKey,
	ReadStrategyBalances: objectTypeGuard<Input["ReadStrategyBalances"]>(
		({ start, end, ...accountStrategyKey }) =>
			isDayInterval({ start, end }) &&
			isAccountStrategyKey(accountStrategyKey)
	),
	ReadStrategyOrders: objectTypeGuard<Input["ReadStrategyOrders"]>(
		({ start, end, ...accountStrategyKey }) =>
			isDayInterval({ start, end }) &&
			isAccountStrategyKey(accountStrategyKey)
	),
	ReadSubscription: isAccountKey,
	RenameAccount: objectTypeGuard<Input["RenameAccount"]>(
		({ name, ...accountKey }) => isName(name) && isAccountKey(accountKey)
	),
	RenameStrategy: objectTypeGuard<Input["RenameStrategy"]>(
		({ name, ...accountStrategyKey }) =>
			isName(name) && isAccountStrategyKey(accountStrategyKey)
	),
	SetAccountCountry: objectTypeGuard<Input["SetAccountCountry"]>(
		({ country, ...accountKey }) =>
			isAllowedCountryIsoCode2(country) && isAccountKey(accountKey)
	),
	WriteAccountStrategiesItemSchedulings: objectTypeGuard<
		Input["WriteAccountStrategiesItemSchedulings"]
	>(
		({ accountId, strategyId, schedulings }) =>
			isItemId(accountId) &&
			isItemId(strategyId) &&
			isStrategySchedulings(schedulings)
	),
	WriteStrategyFlow: objectTypeGuard<Input["WriteStrategyFlow"]>(
		({ view, ...accountStrategyKey }) =>
			isFlowViewSerializableGraph(view) &&
			isAccountStrategyKey(accountStrategyKey)
	)
}
