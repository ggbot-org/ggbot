import {
	Account,
	AccountInfo,
	AccountKey,
	AccountStrategy,
	AllowedCountryIsoCode2,
	BinanceApiConfig,
	CreationTime,
	DeletionTime,
	EmailAddress,
	isAllowedCountryIsoCode2,
	isBinanceApiConfig,
	isEmailAddress,
	isFlowViewSerializableGraph,
	isName,
	isNaturalNumber,
	isPaymentProvider,
	isStrategy,
	isStrategyKey,
	isStrategySchedulings,
	isSubscriptionPlan,
	NaturalNumber,
	NewItem,
	nullId,
	Order,
	PaymentProvider,
	Strategy,
	StrategyFlow,
	StrategyKey,
	Subscription,
	SubscriptionPlan,
	UpdateTime
} from "@workspace/models"
import { DayInterval, isDayInterval } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { Actions } from "./action.js"
import { BinanceClientAction, BinanceClientActionType } from "./binance.js"

export type UserDatabaseAction = {
	CopyStrategy: (
		arg: StrategyKey & Pick<Strategy, "name">
	) => Promise<StrategyKey>
	CreateBinanceApiConfig: (arg: BinanceApiConfig) => Promise<CreationTime>
	CreatePurchaseOrder: (arg: {
		country: AllowedCountryIsoCode2
		email: EmailAddress
		numMonths: NaturalNumber
		paymentProvider: PaymentProvider
		plan: SubscriptionPlan
	}) => Promise<null>
	CreateStrategy: (
		arg: Omit<NewItem<Strategy>, keyof AccountKey>
	) => Promise<StrategyKey>
	DeleteAccount: (arg: void) => Promise<DeletionTime>
	DeleteBinanceApiConfig: (arg: void) => Promise<DeletionTime>
	DeleteStrategy: (arg: StrategyKey) => Promise<DeletionTime>
	ReadAccountInfo: (arg: void) => Promise<AccountInfo | null>
	ReadAccountStrategies: (arg: void) => Promise<AccountStrategy[]>
	ReadBinanceApiKey: (
		arg: void
	) => Promise<Pick<BinanceApiConfig, "apiKey"> | null>
	// TODO ReadStrategyBalances: ( arg: StrategyKey & DayInterval) => Promise<StrategyBalance[] |null>
	ReadStrategyOrders: (arg: StrategyKey & DayInterval) => Promise<Order[]>
	ReadSubscription: (arg: void) => Promise<Subscription | null>
	RenameAccount: (arg: Required<Pick<Account, "name">>) => Promise<UpdateTime>
	RenameStrategy: (
		arg: StrategyKey & Required<Pick<Strategy, "name">>
	) => Promise<UpdateTime>
	SetAccountCountry: (
		arg: Required<Pick<Account, "country">>
	) => Promise<UpdateTime>
	/**
	 * @remarks
	 * Need also `strategyKind` in order to write suggested `frequency` to
	 * strategy.
	 */
	WriteAccountStrategiesItemSchedulings: (
		arg: StrategyKey & Pick<AccountStrategy, "schedulings">
	) => Promise<UpdateTime>
	WriteStrategyFlow: (
		arg: StrategyKey & Omit<StrategyFlow, "whenUpdated">
	) => Promise<UpdateTime>
}
type UserDatabaseActionType = keyof UserDatabaseAction
export type UserClientAction = UserDatabaseAction &
	Pick<BinanceClientAction, "ReadBinanceAccountApiRestrictions">
export type UserClientActionType =
	| UserDatabaseActionType
	| Extract<BinanceClientActionType, "ReadBinanceAccountApiRestrictions">
export const userClientActions: Actions<UserClientActionType> = [
	"CopyStrategy",
	"CreateBinanceApiConfig",
	"CreatePurchaseOrder",
	"CreateStrategy",
	"DeleteAccount",
	"DeleteBinanceApiConfig",
	"ReadAccountInfo",
	"ReadAccountStrategies",
	"ReadBinanceApiKey",
	"ReadStrategyOrders",
	"ReadSubscription",
	"RenameAccount",
	"RenameStrategy",
	"SetAccountCountry",
	"WriteAccountStrategiesItemSchedulings",
	"WriteStrategyFlow",
	"ReadBinanceAccountApiRestrictions"
] as const

export type UserDatabaseActionInput = {
	CopyStrategy: Parameters<UserClientAction["CopyStrategy"]>[0]
	CreateBinanceApiConfig: Parameters<
		UserClientAction["CreateBinanceApiConfig"]
	>[0]
	CreatePurchaseOrder: Parameters<UserClientAction["CreatePurchaseOrder"]>[0]
	CreateStrategy: Parameters<UserClientAction["CreateStrategy"]>[0]
	DeleteStrategy: Parameters<UserClientAction["DeleteStrategy"]>[0]
	// TODO ReadStrategyBalances: Parameters<UserClientAction['ReadStrategyBalances']>[0]
	ReadStrategyOrders: Parameters<UserClientAction["ReadStrategyOrders"]>[0]
	RenameAccount: Parameters<UserClientAction["RenameAccount"]>[0]
	RenameStrategy: Parameters<UserClientAction["RenameStrategy"]>[0]
	SetAccountCountry: Parameters<UserClientAction["SetAccountCountry"]>[0]
	WriteAccountStrategiesItemSchedulings: Parameters<
		UserClientAction["WriteAccountStrategiesItemSchedulings"]
	>[0]
	WriteStrategyFlow: Parameters<UserClientAction["WriteStrategyFlow"]>[0]
}

type UserClientActionInput = UserDatabaseActionInput

export type UserDatabaseActionOutput = {
	CopyStrategy: Awaited<ReturnType<UserClientAction["CopyStrategy"]>>
	CreateBinanceApiConfig: Awaited<
		ReturnType<UserClientAction["CreateBinanceApiConfig"]>
	>
	CreatePurchaseOrder: Awaited<
		ReturnType<UserClientAction["CreatePurchaseOrder"]>
	>
	CreateStrategy: Awaited<ReturnType<UserClientAction["CreateStrategy"]>>
	DeleteAccount: Awaited<ReturnType<UserClientAction["DeleteAccount"]>>
	DeleteBinanceApiConfig: Awaited<
		ReturnType<UserClientAction["DeleteBinanceApiConfig"]>
	>
	DeleteStrategy: Awaited<ReturnType<UserClientAction["DeleteStrategy"]>>
	ReadAccountInfo: Awaited<ReturnType<UserClientAction["ReadAccountInfo"]>>
	ReadAccountStrategies: Awaited<
		ReturnType<UserClientAction["ReadAccountStrategies"]>
	>
	ReadBinanceApiKey: Awaited<
		ReturnType<UserClientAction["ReadBinanceApiKey"]>
	>
	// TODO ReadStrategyBalances: Awaited<ReturnType<UserClientAction['ReadStrategyBalances']>>
	ReadStrategyOrders: Awaited<
		ReturnType<UserClientAction["ReadStrategyOrders"]>
	>
	ReadSubscription: Awaited<ReturnType<UserClientAction["ReadSubscription"]>>
	RenameAccount: Awaited<ReturnType<UserClientAction["RenameAccount"]>>
	SetAccountCountry: Awaited<
		ReturnType<UserClientAction["SetAccountCountry"]>
	>
	WriteAccountStrategiesItemSchedulings: Awaited<
		ReturnType<UserClientAction["WriteAccountStrategiesItemSchedulings"]>
	>
	WriteStrategyFlow: Awaited<
		ReturnType<UserClientAction["WriteStrategyFlow"]>
	>
}

export const isUserActionInput = {
	CopyStrategy: objectTypeGuard<UserClientActionInput["CopyStrategy"]>(
		({ name, ...strategyKey }) => isStrategyKey(strategyKey) && isName(name)
	),
	CreateBinanceApiConfig: objectTypeGuard<
		UserClientActionInput["CreateBinanceApiConfig"]
	>((binanceApiConfig) => isBinanceApiConfig(binanceApiConfig)),
	CreatePurchaseOrder: objectTypeGuard<
		UserClientActionInput["CreatePurchaseOrder"]
	>(
		({ country, email, numMonths, paymentProvider, plan }) =>
			isEmailAddress(email) &&
			isSubscriptionPlan(plan) &&
			isAllowedCountryIsoCode2(country) &&
			isNaturalNumber(numMonths) &&
			isPaymentProvider(paymentProvider)
	),
	CreateStrategy: objectTypeGuard<UserClientActionInput["CreateStrategy"]>(
		(arg) => isStrategy({ ...arg, id: nullId, whenCreated: 1 })
	),
	DeleteStrategy: isStrategyKey,
	// TODO
	// ReadStrategyBalances: objectTypeGuard<UserClientActionInput["ReadStrategyBalances"]>(
	// 	({ start, end, ...strategyKey }) =>
	// 		isDayInterval({ start, end }) &&
	// 		isStrategyKey(strategyKey)
	// ),
	ReadStrategyOrders: objectTypeGuard<
		UserClientActionInput["ReadStrategyOrders"]
	>(
		({ start, end, ...strategyKey }) =>
			isDayInterval({ start, end }) && isStrategyKey(strategyKey)
	),
	RenameAccount: objectTypeGuard<UserClientActionInput["RenameAccount"]>(
		({ name }) => isName(name)
	),
	RenameStrategy: objectTypeGuard<UserClientActionInput["RenameStrategy"]>(
		({ name, ...strategyKey }) => isName(name) && isStrategyKey(strategyKey)
	),
	SetAccountCountry: objectTypeGuard<
		UserClientActionInput["SetAccountCountry"]
	>(({ country }) => isAllowedCountryIsoCode2(country)),
	WriteAccountStrategiesItemSchedulings: objectTypeGuard<
		UserClientActionInput["WriteAccountStrategiesItemSchedulings"]
	>(
		({ schedulings, ...strategyKey }) =>
			isStrategyKey(strategyKey) && isStrategySchedulings(schedulings)
	),
	WriteStrategyFlow: objectTypeGuard<
		UserClientActionInput["WriteStrategyFlow"]
	>(
		({ view, ...strategyKey }) =>
			isFlowViewSerializableGraph(view) && isStrategyKey(strategyKey)
	)
}
