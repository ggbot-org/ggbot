import { AccountInfo, AccountKey, AccountStrategy, BalanceEvent, BinanceApiConfig, CreationTime, DeletionTime, isBinanceApiConfig, isName, isStrategy, isStrategyFlowView, isStrategyKey, isStrategySchedulings, NewItem, nullId, Order, Strategy, StrategyError, StrategyFlow, StrategyKey, Subscription, UpdateTime } from "@workspace/models"
import { DayInterval, isDayInterval } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { Action, ActionTypes } from "./action.js"
import { BinanceClientActionType, BinanceClientInput, BinanceClientOutput } from "./binance.js"

export type UserDatabaseAction = {
	CopyStrategy: (arg: StrategyKey & Pick<Strategy, "name">) => Promise<StrategyKey>
	CreateBinanceApiConfig: (arg: BinanceApiConfig) => Promise<CreationTime>
	CreateStrategy: (arg: Omit<NewItem<Strategy>, keyof AccountKey>) => Promise<StrategyKey>
	DeleteAccount: Action<void, DeletionTime>
	DeleteBinanceApiConfig: (arg: void) => Promise<DeletionTime>
	DeleteStrategy: (arg: StrategyKey) => Promise<DeletionTime>
	ReadBalances: (arg: DayInterval) => Promise<BalanceEvent[]>
	ReadAccountInfo: (arg: void) => Promise<AccountInfo | null>
	ReadBinanceApiKey: (arg: void) => Promise<Pick<BinanceApiConfig, "apiKey"> | null>
	ReadStrategies: (arg: void) => Promise<AccountStrategy[]>
	ReadStrategyErrors: (arg: StrategyKey & DayInterval) => Promise<StrategyError[]>
	ReadStrategyOrders: (arg: StrategyKey & DayInterval) => Promise<Order[]>
	ReadSubscription: (arg: void) => Promise<Subscription | null>
	RenameStrategy: (arg: StrategyKey & Required<Pick<Strategy, "name">>) => Promise<UpdateTime>
	/**
	 * Write schedulings for strategy.
	 *
	 * @remarks
	 * Needs also `strategyKind` in order to write suggested `frequency` to strategy.
	 */
	WriteAccountStrategiesItemSchedulings: (arg: StrategyKey & Pick<AccountStrategy, "schedulings">) => Promise<UpdateTime>
	WriteStrategyFlow: (arg: StrategyKey & Omit<StrategyFlow, "whenUpdated">) => Promise<UpdateTime>
}

type UserDatabaseActionType = keyof UserDatabaseAction

export type UserDatabaseActionInput = {
	CopyStrategy: Parameters<UserDatabaseAction["CopyStrategy"]>[0]
	CreateBinanceApiConfig: Parameters<UserDatabaseAction["CreateBinanceApiConfig"]>[0]
	CreateStrategy: Parameters<UserDatabaseAction["CreateStrategy"]>[0]
	DeleteAccount: Parameters<UserDatabaseAction["DeleteAccount"]>[0]
	DeleteBinanceApiConfig: Parameters<UserDatabaseAction["DeleteBinanceApiConfig"]>[0]
	DeleteStrategy: Parameters<UserDatabaseAction["DeleteStrategy"]>[0]
	ReadBalances: Parameters<UserDatabaseAction["ReadBalances"]>[0]
	ReadAccountInfo: Parameters<UserDatabaseAction["ReadAccountInfo"]>[0]
	ReadBinanceApiKey: Parameters<UserDatabaseAction["ReadBinanceApiKey"]>[0]
	ReadStrategies: Parameters<UserDatabaseAction["ReadStrategies"]>[0]
	ReadStrategyErrors: Parameters<UserDatabaseAction["ReadStrategyErrors"]>[0]
	ReadStrategyOrders: Parameters<UserDatabaseAction["ReadStrategyOrders"]>[0]
	ReadSubscription: Parameters<UserDatabaseAction["ReadSubscription"]>[0]
	RenameStrategy: Parameters<UserDatabaseAction["RenameStrategy"]>[0]
	WriteAccountStrategiesItemSchedulings: Parameters<UserDatabaseAction["WriteAccountStrategiesItemSchedulings"]>[0]
	WriteStrategyFlow: Parameters<UserDatabaseAction["WriteStrategyFlow"]>[0]
}

export type UserDatabaseActionOutput = {
	CopyStrategy: Awaited<ReturnType<UserDatabaseAction["CopyStrategy"]>>
	CreateBinanceApiConfig: Awaited<ReturnType<UserDatabaseAction["CreateBinanceApiConfig"]>>
	CreateStrategy: Awaited<ReturnType<UserDatabaseAction["CreateStrategy"]>>
	DeleteAccount: Awaited<ReturnType<UserDatabaseAction["DeleteAccount"]>>
	DeleteBinanceApiConfig: Awaited<ReturnType<UserDatabaseAction["DeleteBinanceApiConfig"]>>
	DeleteStrategy: Awaited<ReturnType<UserDatabaseAction["DeleteStrategy"]>>
	ReadBalances: Awaited<ReturnType<UserDatabaseAction["ReadBalances"]>>
	ReadAccountInfo: Awaited<ReturnType<UserDatabaseAction["ReadAccountInfo"]>>
	ReadBinanceApiKey: Awaited<ReturnType<UserDatabaseAction["ReadBinanceApiKey"]>>
	ReadStrategies: Awaited<ReturnType<UserDatabaseAction["ReadStrategies"]>>
	ReadStrategyErrors: Awaited<ReturnType<UserDatabaseAction["ReadStrategyErrors"]>>
	ReadStrategyOrders: Awaited<ReturnType<UserDatabaseAction["ReadStrategyOrders"]>>
	ReadSubscription: Awaited<ReturnType<UserDatabaseAction["ReadSubscription"]>>
	RenameStrategy: Awaited<ReturnType<UserDatabaseAction["RenameStrategy"]>>
	WriteAccountStrategiesItemSchedulings: Awaited<ReturnType<UserDatabaseAction["WriteAccountStrategiesItemSchedulings"]>>
	WriteStrategyFlow: Awaited<ReturnType<UserDatabaseAction["WriteStrategyFlow"]>>
}

export type UserClientActionType =
	| Exclude<UserDatabaseActionType, "ReadSubscription">
	| Extract<BinanceClientActionType, "ReadBinanceAccountApiRestrictions">

export const userClientActions: ActionTypes<UserClientActionType> = [
	// UserDatabase action types.
	"CopyStrategy",
	"CreateBinanceApiConfig",
	"CreateStrategy",
	"DeleteAccount",
	"DeleteBinanceApiConfig",
	"DeleteStrategy",
	"ReadAccountInfo",
	"ReadBalances",
	"ReadBinanceApiKey",
	"ReadStrategies",
	"ReadStrategyErrors",
	"ReadStrategyOrders",
	"RenameStrategy",
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
	CreateBinanceApiConfig: objectTypeGuard<UserClientActionInput["CreateBinanceApiConfig"]>(
		(binanceApiConfig) => isBinanceApiConfig(binanceApiConfig)
	),
	CreateStrategy: objectTypeGuard<UserClientActionInput["CreateStrategy"]>(
		(arg) => isStrategy({ ...arg, accountId: nullId, id: nullId, whenCreated: 1 })
	),
	DeleteStrategy: isStrategyKey,
	ReadBalances: objectTypeGuard<UserClientActionInput["ReadBalances"]>(isDayInterval),
	ReadStrategyErrors: objectTypeGuard<UserClientActionInput["ReadStrategyErrors"]>(
		({ start, end, ...strategyKey }) => isDayInterval({ start, end }) && isStrategyKey(strategyKey)
	),
	ReadStrategyOrders: objectTypeGuard<UserClientActionInput["ReadStrategyOrders"]>(
		({ start, end, ...strategyKey }) => isDayInterval({ start, end }) && isStrategyKey(strategyKey)
	),
	RenameStrategy: objectTypeGuard<UserClientActionInput["RenameStrategy"]>(
		({ name, ...strategyKey }) => isName(name) && isStrategyKey(strategyKey)
	),
	WriteAccountStrategiesItemSchedulings: objectTypeGuard<UserClientActionInput["WriteAccountStrategiesItemSchedulings"]>(
		({ schedulings, ...strategyKey }) => isStrategyKey(strategyKey) && isStrategySchedulings(schedulings)
	),
	WriteStrategyFlow: objectTypeGuard<UserClientActionInput["WriteStrategyFlow"]>(
		({ view, ...strategyKey }) => isStrategyFlowView(view) && isStrategyKey(strategyKey)
	)
}
