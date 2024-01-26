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
	isStrategyKey,
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
	StrategyKey,
	Subscription,
	SubscriptionPlan,
	UpdateTime
} from "@workspace/models"
import { DayInterval, isDayInterval } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

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

type Action = {
	CopyStrategy: (
		arg: StrategyKey & Pick<Strategy, "name">
	) => Promise<Strategy>
	CreateBinanceApiConfig: (arg: BinanceApiConfig) => Promise<CreationTime>
	CreatePurchaseOrder: (arg: Input["CreatePurchaseOrder"]) => Promise<null>
	CreateStrategy: (
		arg: Omit<NewItem<Strategy>, keyof AccountKey>
	) => Promise<Strategy>
	DeleteAccount: () => Promise<DeletionTime>
	DeleteBinanceApiConfig: () => Promise<DeletionTime>
	DeleteStrategy: (arg: StrategyKey) => Promise<DeletionTime>
	ReadAccountInfo: () => Promise<AccountInfo | null>
	ReadAccountStrategies: () => Promise<AccountStrategy[] | null>
	ReadBinanceApiKey: () => Promise<Pick<BinanceApiConfig, "apiKey"> | null>
	ReadBinanceApiKeyPermissions: () => Promise<BinanceApiKeyPermissionCriteria>
	ReadStrategyBalances: (
		arg: Input["ReadStrategyBalances"]
	) => Promise<StrategyBalance[]>
	ReadStrategyOrders: (
		arg: Input["ReadStrategyOrders"]
	) => Promise<Order[] | null>
	ReadSubscription: () => Promise<Subscription | null>
	RenameAccount: (arg: Input["RenameAccount"]) => Promise<UpdateTime>
	RenameStrategy: (arg: Input["RenameStrategy"]) => Promise<UpdateTime>
	SetAccountCountry: (arg: Input["SetAccountCountry"]) => Promise<UpdateTime>
	WriteAccountStrategiesItemSchedulings: (
		arg: Input["WriteAccountStrategiesItemSchedulings"]
	) => Promise<UpdateTime>
	WriteStrategyFlow: (
		arg: StrategyKey & Omit<StrategyFlow, "whenUpdated">
	) => Promise<UpdateTime>
}

export type UserApiAction = Action

type Input = {
	CopyStrategy: Parameters<Action["CopyStrategy"]>[0]
	CreateBinanceApiConfig: Parameters<Action["CreateBinanceApiConfig"]>[0]
	CreatePurchaseOrder: AccountKey & {
		country: AllowedCountryIsoCode2
		email: EmailAddress
		numMonths: NaturalNumber
		paymentProvider: PaymentProvider
		plan: SubscriptionPlan
	}
	CreateStrategy: Parameters<Action["CreateStrategy"]>[0]
	DeleteStrategy: Parameters<Action["DeleteStrategy"]>[0]
	ReadStrategyBalances: AccountStrategyKey & DayInterval
	ReadStrategyOrders: AccountStrategyKey & DayInterval
	RenameAccount: AccountKey & { name: Name }
	RenameStrategy: AccountStrategyKey & Pick<Strategy, "name">
	SetAccountCountry: AccountKey & { country: AllowedCountryIsoCode2 }
	// Need also `strategyKind` in order to write suggested frequency to strategy.
	WriteAccountStrategiesItemSchedulings: AccountStrategyItemKey &
		Pick<AccountStrategyKey, "strategyKind"> &
		Pick<AccountStrategy, "schedulings">
	WriteStrategyFlow: Parameters<Action["WriteStrategyFlow"]>[0]
}

export type UserApiInput = Input

export type UserApiOutput = {
	CreateStrategy: Awaited<ReturnType<Action["CreateStrategy"]>>
	CopyStrategy: Awaited<ReturnType<Action["CreateStrategy"]>>
	DeleteStrategy: Awaited<ReturnType<Action["DeleteStrategy"]>>
	ReadAccountStrategies: Awaited<ReturnType<Action["ReadAccountStrategies"]>>
	ReadSubscription: Awaited<ReturnType<Action["ReadSubscription"]>>
	WriteStrategyFlow: Awaited<ReturnType<Action["WriteStrategyFlow"]>>
}

export const isUserApiInput = {
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
	DeleteStrategy: isStrategyKey,
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
