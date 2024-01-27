import {
	Account,
	AccountInfo,
	AccountKey,
	AccountStrategy,
	AllowedCountryIsoCode2,
	BinanceApiConfig,
	BinanceApiKeyPermissionCriteria,
	CreationTime,
	DeletionTime,
	EmailAddress,
	NaturalNumber,
	NewItem,
	Order,
	PaymentProvider,
	Strategy,
	StrategyBalance,
	StrategyFlow,
	StrategyKey,
	Subscription,
	SubscriptionPlan,
	UpdateTime,
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
	nullId,
} from "@workspace/models"
import {DayInterval, isDayInterval} from 'minimal-time-helpers'
import { objectTypeGuard } from "minimal-type-guard-helpers"
import {ActionInputValidators, __noInput} from "./action"

type Action = {
	CopyStrategy: (
		arg: StrategyKey & Pick<Strategy, "name">
	) => Promise<Strategy>,
	CreateBinanceApiConfig: (arg: BinanceApiConfig) => Promise<CreationTime>
	CreatePurchaseOrder: (arg:  {
		country: AllowedCountryIsoCode2
		email: EmailAddress
		numMonths: NaturalNumber
		paymentProvider: PaymentProvider
		plan: SubscriptionPlan
	}) => Promise<null>
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
	ReadStrategyBalances: ( arg: StrategyKey & DayInterval) => Promise<StrategyBalance[] |null>
	ReadStrategyOrders: ( arg: StrategyKey & DayInterval) => Promise<Order []>
	ReadSubscription: () => Promise<Subscription| null>
	RenameAccount: (arg: Required<Pick<Account, 'name' >>) => Promise<UpdateTime>
	RenameStrategy: (arg: StrategyKey & Required<Pick<Strategy, "name">>) => Promise<UpdateTime>
	SetAccountCountry: (arg: Required<Pick<Account, 'country'>>) => Promise<UpdateTime>
	/**
	 * @remarks
	 * Need also `strategyKind` in order to write suggested `frequency` to strategy.
	 */
	WriteAccountStrategiesItemSchedulings: (
		arg:
	 StrategyKey &
		Pick<AccountStrategy, "schedulings">
	) => Promise<UpdateTime>
	WriteStrategyFlow: (
		arg: StrategyKey & Omit<StrategyFlow, "whenUpdated">
	) => Promise<UpdateTime>
}
export type UserAction = Action
export type UserActionType = keyof Action

type Input = {
	CopyStrategy: Parameters<Action['CopyStrategy']>[0]
	CreateBinanceApiConfig: Parameters<Action['CreateBinanceApiConfig']>[0]
	CreatePurchaseOrder: Parameters<Action['CreatePurchaseOrder']>[0]
	CreateStrategy: Parameters<Action['CreateStrategy']>[0]
	DeleteAccount: void
	DeleteBinanceApiConfig: void
	DeleteStrategy: Parameters<Action['DeleteStrategy']>[0]
	ReadAccountInfo: void
	ReadAccountStrategies: void
	ReadBinanceApiKey: void
    ReadStrategyBalances: Parameters<Action['ReadStrategyBalances']>[0]
    ReadStrategyOrders: Parameters<Action['ReadStrategyOrders']>[0]
    RenameAccount: Parameters<Action['RenameAccount']>[0]
    RenameStrategy: Parameters<Action['RenameStrategy']>[0]
    SetAccountCountry: Parameters<Action['SetAccountCountry']>[0]
    WriteAccountStrategiesItemSchedulings: Parameters<Action['WriteAccountStrategiesItemSchedulings']>[0]
    WriteStrategyFlow: Parameters<Action['WriteStrategyFlow']>[0]
}
export type UserActionInput = Input

type Output = {
	CopyStrategy: Awaited<ReturnType<Action['CopyStrategy']>>
	CreateBinanceApiConfig: Awaited<ReturnType<Action['CreateBinanceApiConfig']>>
	CreatePurchaseOrder: Awaited<ReturnType<Action['CreatePurchaseOrder']>>
	CreateStrategy: Awaited<ReturnType<Action['CreateStrategy']>>
	DeleteAccount: Awaited<ReturnType<Action['DeleteAccount']>>
	DeleteBinanceApiConfig: Awaited<ReturnType<Action['DeleteBinanceApiConfig']>>
	DeleteStrategy: Awaited<ReturnType<Action['DeleteStrategy']>>
	ReadAccountInfo: Awaited<ReturnType<Action['ReadAccountInfo']>>
	ReadAccountStrategies: Awaited<ReturnType<Action['ReadAccountStrategies']>>
	ReadBinanceApiKey: Awaited<ReturnType<Action['ReadBinanceApiKey']>>
	ReadBinanceApiKeyPermissions: Awaited<ReturnType<Action['ReadBinanceApiKeyPermissions']>>
	ReadStrategyBalances: Awaited<ReturnType<Action['ReadStrategyBalances']>>
	ReadStrategyOrders: Awaited<ReturnType<Action['ReadStrategyOrders']>>
	ReadSubscription: Awaited<ReturnType<Action['ReadSubscription']>>
	RenameAccount: Awaited<ReturnType<Action['RenameAccount']>>
	SetAccountCountry: Awaited<ReturnType<Action['SetAccountCountry']>>
	WriteAccountStrategiesItemSchedulings: Awaited<ReturnType<Action['WriteAccountStrategiesItemSchedulings']>>
	WriteStrategyFlow: Awaited<ReturnType<Action['WriteStrategyFlow']>>
}
export type UserActionOutput = Output

export const isUserActionInput = {
	CopyStrategy: objectTypeGuard<Input["CopyStrategy"]>(
		({ name, ...strategyKey }) =>
			isStrategyKey(strategyKey) && isName(name)
	),
	CreateBinanceApiConfig: objectTypeGuard<Input["CreateBinanceApiConfig"]>(
		(binanceApiConfig) =>
			isBinanceApiConfig(binanceApiConfig)
	),
	CreatePurchaseOrder: objectTypeGuard<Input["CreatePurchaseOrder"]>(
		({ country, email, numMonths, paymentProvider, plan }) =>
			isEmailAddress(email) &&
			isSubscriptionPlan(plan) &&
			isAllowedCountryIsoCode2(country) &&
			isNaturalNumber(numMonths) &&
			isPaymentProvider(paymentProvider)
	),
	CreateStrategy: objectTypeGuard<Input["CreateStrategy"]>((arg) =>
		isStrategy({ ...arg, id: nullId, whenCreated: 1 })
	),
	DeleteAccount: __noInput,
	 DeleteBinanceApiConfig: __noInput,
	DeleteStrategy: isStrategyKey,
	ReadAccountInfo: __noInput,
	 ReadAccountStrategies: __noInput,
	 ReadBinanceApiKey: __noInput,
	 ReadBinanceApiKeyPermissions: __noInput,
	ReadStrategyBalances: objectTypeGuard<Input["ReadStrategyBalances"]>(
		({ start, end, ...strategyKey }) =>
			isDayInterval({ start, end }) &&
			isStrategyKey(strategyKey)
	),
	ReadStrategyOrders: objectTypeGuard<Input["ReadStrategyOrders"]>(
		({ start, end, ...strategyKey }) =>
			isDayInterval({ start, end }) &&
			isStrategyKey(strategyKey)
	),
	RenameAccount: objectTypeGuard<Input["RenameAccount"]>( ({ name }) => isName(name)),
		ReadSubscription: __noInput,
	RenameStrategy: objectTypeGuard<Input["RenameStrategy"]>(
		({ name, ...strategyKey }) => isName(name) && isStrategyKey(strategyKey)
	),
	SetAccountCountry: objectTypeGuard<Input["SetAccountCountry"]>(
		({ country }) =>
			isAllowedCountryIsoCode2(country)
	),
	WriteAccountStrategiesItemSchedulings: objectTypeGuard<
		Input["WriteAccountStrategiesItemSchedulings"]
	>(
		({ schedulings, ...strategyKey }) =>
			isStrategyKey(strategyKey) &&
			isStrategySchedulings(schedulings)
	),
	WriteStrategyFlow: objectTypeGuard<Input["WriteStrategyFlow"]>(
		({ view, ...strategyKey }) =>
			isFlowViewSerializableGraph(view) &&
			isStrategyKey(strategyKey)
	)
} satisfies ActionInputValidators<UserActionType>
