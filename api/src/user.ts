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
	StrategyError,
	StrategyFlow,
	StrategyKey,
	Subscription,
	SubscriptionPlan,
	UpdateTime
} from "@workspace/models"
import { DayInterval, isDayInterval } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { Action, ActionTypes } from "./action.js"
import {
	BinanceClientActionType,
	BinanceClientInput,
	BinanceClientOutput
} from "./binance.js"

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
	DeleteAccount: Action<void, DeletionTime>
	DeleteBinanceApiConfig: (arg: void) => Promise<DeletionTime>
	DeleteStrategy: (arg: StrategyKey) => Promise<DeletionTime>
	ReadAccountInfo: (arg: void) => Promise<AccountInfo | null>
	ReadAccountStrategies: (arg: void) => Promise<AccountStrategy[]>
	ReadBinanceApiKey: (
		arg: void
	) => Promise<Pick<BinanceApiConfig, "apiKey"> | null>
	// TODO ReadStrategyBalances: ( arg: StrategyKey & DayInterval) => Promise<StrategyBalance[] |null>
	ReadStrategyErrors: (
		arg: StrategyKey & DayInterval
	) => Promise<StrategyError[]>
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

export type UserDatabaseActionInput = {
	CopyStrategy: Parameters<UserDatabaseAction["CopyStrategy"]>[0]
	CreateBinanceApiConfig: Parameters<
		UserDatabaseAction["CreateBinanceApiConfig"]
	>[0]
	CreatePurchaseOrder: Parameters<
		UserDatabaseAction["CreatePurchaseOrder"]
	>[0]
	CreateStrategy: Parameters<UserDatabaseAction["CreateStrategy"]>[0]
	DeleteAccount: Parameters<UserDatabaseAction["DeleteAccount"]>[0]
	DeleteBinanceApiConfig: Parameters<
		UserDatabaseAction["DeleteBinanceApiConfig"]
	>[0]
	DeleteStrategy: Parameters<UserDatabaseAction["DeleteStrategy"]>[0]
	ReadAccountInfo: Parameters<UserDatabaseAction["ReadAccountInfo"]>[0]
	// TODO ReadStrategyBalances: Parameters<UserDatabaseAction['ReadStrategyBalances']>[0]
	ReadAccountStrategies: Parameters<
		UserDatabaseAction["ReadAccountStrategies"]
	>[0]
	ReadBinanceApiKey: Parameters<UserDatabaseAction["ReadBinanceApiKey"]>[0]
	ReadStrategyErrors: Parameters<UserDatabaseAction["ReadStrategyErrors"]>[0]
	ReadStrategyOrders: Parameters<UserDatabaseAction["ReadStrategyOrders"]>[0]
	ReadSubscription: Parameters<UserDatabaseAction["ReadSubscription"]>[0]
	RenameAccount: Parameters<UserDatabaseAction["RenameAccount"]>[0]
	RenameStrategy: Parameters<UserDatabaseAction["RenameStrategy"]>[0]
	SetAccountCountry: Parameters<UserDatabaseAction["SetAccountCountry"]>[0]
	WriteAccountStrategiesItemSchedulings: Parameters<
		UserDatabaseAction["WriteAccountStrategiesItemSchedulings"]
	>[0]
	WriteStrategyFlow: Parameters<UserDatabaseAction["WriteStrategyFlow"]>[0]
}

export type UserDatabaseActionOutput = {
	CopyStrategy: Awaited<ReturnType<UserDatabaseAction["CopyStrategy"]>>
	CreateBinanceApiConfig: Awaited<
		ReturnType<UserDatabaseAction["CreateBinanceApiConfig"]>
	>
	CreatePurchaseOrder: Awaited<
		ReturnType<UserDatabaseAction["CreatePurchaseOrder"]>
	>
	CreateStrategy: Awaited<ReturnType<UserDatabaseAction["CreateStrategy"]>>
	DeleteAccount: Awaited<ReturnType<UserDatabaseAction["DeleteAccount"]>>
	DeleteBinanceApiConfig: Awaited<
		ReturnType<UserDatabaseAction["DeleteBinanceApiConfig"]>
	>
	DeleteStrategy: Awaited<ReturnType<UserDatabaseAction["DeleteStrategy"]>>
	ReadAccountInfo: Awaited<ReturnType<UserDatabaseAction["ReadAccountInfo"]>>
	ReadAccountStrategies: Awaited<
		ReturnType<UserDatabaseAction["ReadAccountStrategies"]>
	>
	ReadBinanceApiKey: Awaited<
		ReturnType<UserDatabaseAction["ReadBinanceApiKey"]>
	>
	// TODO ReadStrategyBalances: Awaited<ReturnType<UserDatabaseAction['ReadStrategyBalances']>>
	ReadStrategyErrors: Awaited<
		ReturnType<UserDatabaseAction["ReadStrategyErrors"]>
	>
	ReadStrategyOrders: Awaited<
		ReturnType<UserDatabaseAction["ReadStrategyOrders"]>
	>
	ReadSubscription: Awaited<
		ReturnType<UserDatabaseAction["ReadSubscription"]>
	>
	RenameAccount: Awaited<ReturnType<UserDatabaseAction["RenameAccount"]>>
	RenameStrategy: Awaited<ReturnType<UserDatabaseAction["RenameStrategy"]>>
	SetAccountCountry: Awaited<
		ReturnType<UserDatabaseAction["SetAccountCountry"]>
	>
	WriteAccountStrategiesItemSchedulings: Awaited<
		ReturnType<UserDatabaseAction["WriteAccountStrategiesItemSchedulings"]>
	>
	WriteStrategyFlow: Awaited<
		ReturnType<UserDatabaseAction["WriteStrategyFlow"]>
	>
}

export type UserClientActionType =
	| UserDatabaseActionType
	| Extract<BinanceClientActionType, "ReadBinanceAccountApiRestrictions">

export const userClientActions: ActionTypes<UserClientActionType> = [
	// UserDatabase action types.
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
	"ReadStrategyErrors",
	"ReadStrategyOrders",
	"ReadSubscription",
	"RenameAccount",
	"RenameStrategy",
	"SetAccountCountry",
	"WriteAccountStrategiesItemSchedulings",
	"WriteStrategyFlow",
	// Binance client action types.
	"ReadBinanceAccountApiRestrictions"
] as const

export type UserClientActionInput = UserDatabaseActionInput &
	Pick<BinanceClientInput, "ReadBinanceAccountApiRestrictions">

export type UserClientActionOutput = UserDatabaseActionOutput &
	Pick<BinanceClientOutput, "ReadBinanceAccountApiRestrictions">

export const isUserClientActionInput = {
	CopyStrategy: objectTypeGuard<UserClientActionInput["CopyStrategy"]>(
		({ name, ...strategyKey }) => isStrategyKey(strategyKey) && isName(name)
	),
	CreateBinanceApiConfig: objectTypeGuard<
		UserClientActionInput["CreateBinanceApiConfig"]
	>((binanceApiConfig) => isBinanceApiConfig(binanceApiConfig)),
	// TODO CreatePurchaseOrder is not a user client action
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
		(arg) =>
			isStrategy({
				...arg,
				accountId: nullId,
				id: nullId,
				whenCreated: 1
			})
	),
	DeleteStrategy: isStrategyKey,
	// TODO
	// ReadStrategyBalances: objectTypeGuard<UserClientActionInput["ReadStrategyBalances"]>(
	// 	({ start, end, ...strategyKey }) =>
	// 		isDayInterval({ start, end }) &&
	// 		isStrategyKey(strategyKey)
	// ),
	ReadStrategyErrors: objectTypeGuard<
		UserClientActionInput["ReadStrategyErrors"]
	>(
		({ start, end, ...strategyKey }) =>
			isDayInterval({ start, end }) && isStrategyKey(strategyKey)
	),
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
