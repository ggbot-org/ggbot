/*
 data-bucket/
 │
 ├╴account/
 │ └╴accountId=XXX/
 │   └╴account.json
 │
 ├╴accountConfig/
 │ └╴accountId=XXX/
 │   └╴binance.json
 │
 ├╴accountOrders/
 │ └╴y=YYYY/
 │   └╴m=MM/
 │     └╴d=DD/
 │       └╴accountId=XXX/
 │         └╴orders.json
 │
 ├╴accountStrategies/
 │ └╴accountId=XXX/
 │   └╴strategies.json
 │
 ├╴emailAccount/
 │ ├╴bitcoin.com/
 │ │ └╴nakamoto/
 │ │   └╴account.json
 │ └╴gmail.com/
 │   └╴jsmith/
 │     └╴account.json
 │
 ├╴oneTimePassword/
 │ ├╴bitcoin.com/
 │ │ └╴nakamoto/
 │ │   └╴otp.json
 │ └╴gmail.com/
 │   └╴jsmith/
 │     └╴otp.json
 │
 ├╴strategy/
 │ └╴strategyKind=XXX/
 │   └╴strategyId=XXX/
 │     └╴strategy.json
 │
 ├╴strategyBalances/
 │ └╴y=YYYY/
 │   └╴m=MM/
 │     └╴d=DD/
 │       └╴accountId=XXX/
 │         └╴strategyKind=XXX/
 │           └╴strategyId=XXX/
 │             └╴balances.json
 │
 ├╴strategyExecution/
 │ └╴accountId=XXX/
 │   └╴strategyKind=XXX/
 │     └╴strategyId=XXX/
 │       └╴execution.json
 │
 ├╴strategyFlow/
 │ └╴strategyKind=XXX/
 │   └╴strategyId=XXX/
 │     └╴flow.json
 │
 ├╴strategyOrders/
 │ └╴y=YYYY/
 │   └╴m=MM/
 │     └╴d=DD/
 │       └╴accountId=XXX/
 │         └╴strategyKind=XXX/
 │           └╴strategyId=XXX/
 │             └╴orders.json
 │
 ├╴strategyOrdersPool/
 │ └╴accountId=XXX/
 │   └╴strategyKind=XXX/
 │     └╴strategyId=XXX/
 │       └╴orders.json
 │
 ├╴subscription
 │ └╴accountId=XXX/
 │   └╴subscription.json
 │
 └╴subscriptionPurchase
   └╴accountId=XXX/
     └╴y=YYYY/
       └╴m=MM/
         └╴d=DD/
           └╴purchase.json
*/

import {
	AccountDailyOrdersKey,
	AccountKey,
	AccountStrategyKey,
	DayKey,
	EmailAddress,
	isAccountDailyOrdersKey,
	isAccountKey,
	isAccountStrategyKey,
	isStrategyDailyBalanceChangesKey,
	isStrategyKey,
	isSubscriptionPurchaseKey,
	normalizeEmailAddress,
	StrategyDailyBalanceChangesKey,
	StrategyDailyOrdersKey,
	StrategyKey,
	SubscriptionPurchaseKey
} from "@workspace/models"
import { isSplittedDay, joinDay, splitDay } from "minimal-time-helpers"
import { isLiteralType } from "minimal-type-guard-helpers"

const dirnameDelimiter = "/"
const dirJoin = (parts: string[]) => parts.join(dirnameDelimiter)

const dayKeyFields = ["y", "m", "d"] as const
const accountKeyFields = ["accountId"] as const
const strategyKeyFields = ["strategyKind", "strategyId"] as const
const subscriptionPurchaseKeyFields = ["purchaseId"] as const
const fieldNames = [
	...accountKeyFields,
	...strategyKeyFields,
	...dayKeyFields,
	...subscriptionPurchaseKeyFields
] as const
type FieldName = (typeof fieldNames)[number]
const isFieldName = isLiteralType<FieldName>(fieldNames)
const fieldSeparator = "="
const fieldJoin = (name: FieldName, value: string) =>
	[name, value].join(fieldSeparator)

const dirnamePrefixes = [
	"account",
	"accountConfig",
	"accountDailyOrders",
	"accountStrategies",
	"emailAccount",
	"oneTimePassword",
	"strategy",
	"strategyDailyBalanceChanges",
	"strategyDailyOrders",
	"strategyExecution",
	"strategyFlow",
	"strategyOrdersPool",
	"subscription",
	"subscriptionPurchase"
] as const

type DirnamePrefix = (typeof dirnamePrefixes)[number]

const dirnamePrefix: Record<DirnamePrefix, string> = {
	account: "account",
	accountConfig: "accountConfig",
	accountDailyOrders: "accountOrders",
	accountStrategies: "accountStrategies",
	emailAccount: "emailAccount",
	oneTimePassword: "oneTimePassword",
	strategy: "strategy",
	strategyDailyBalanceChanges: "strategyBalances",
	strategyDailyOrders: "strategyOrders",
	strategyExecution: "strategyExecution",
	strategyFlow: "strategyFlow",
	strategyOrdersPool: "strategyOrdersPool",
	subscription: "subscription",
	subscriptionPurchase: "subscriptionPurchase"
}

const destructureLocator = (
	locator: string,
	fieldNames: readonly FieldName[]
) => {
	const result: Record<string, string> = {}
	for (const locatorPart of locator.split(dirnameDelimiter)) {
		const [fieldName, value] = locatorPart.split(fieldSeparator)
		if (!isFieldName(fieldName)) continue
		// If value is `undefined`, this `locatorPart` could be a prefix. Skip it.
		if (value === undefined) continue
		if (fieldNames.includes(fieldName)) result[fieldName] = value
	}
	return result
}

export const locatorToItemKey = {
	account: (locator: string): AccountKey | undefined => {
		const obj = destructureLocator(locator, ["accountId"])
		return isAccountKey(obj) ? obj : undefined
	},
	accountDailyOrders: (
		locator: string
	): AccountDailyOrdersKey | undefined => {
		const obj = destructureLocator(locator, [
			...accountKeyFields,
			...dayKeyFields
		])
		return isAccountDailyOrdersKey(obj) ? obj : undefined
	},
	accountStrategy: (locator: string): AccountStrategyKey | undefined => {
		const obj = destructureLocator(locator, [
			...accountKeyFields,
			...strategyKeyFields
		])
		return isAccountStrategyKey(obj) ? obj : undefined
	},
	day: (locator: string): DayKey | undefined => {
		const obj = destructureLocator(locator, dayKeyFields)
		return isSplittedDay(obj) ? { day: joinDay(obj) } : undefined
	},
	strategy: (locator: string): StrategyKey | undefined => {
		const obj = destructureLocator(locator, strategyKeyFields)
		return isStrategyKey(obj) ? obj : undefined
	},
	strategyDailyBalanceChanges: (
		locator: string
	): StrategyDailyBalanceChangesKey | undefined => {
		const obj = destructureLocator(locator, [
			...dayKeyFields,
			...accountKeyFields,
			...strategyKeyFields
		])
		return isStrategyDailyBalanceChangesKey(obj) ? obj : undefined
	},
	subscriptionPurchase: (
		locator: string
	): SubscriptionPurchaseKey | undefined => {
		const obj = destructureLocator(locator, [
			...dayKeyFields,
			...accountKeyFields,
			"purchaseId"
		])
		return isSubscriptionPurchaseKey(obj) ? obj : undefined
	}
}

export const itemKeyToDirname = {
	account: ({ accountId }: AccountKey) => fieldJoin("accountId", accountId),
	accountDailyOrders: ({ day, ...key }: AccountDailyOrdersKey) =>
		dirJoin([itemKeyToDirname.day({ day }), itemKeyToDirname.account(key)]),
	accountStrategy: ({ accountId, ...strategyKey }: AccountStrategyKey) =>
		dirJoin([
			itemKeyToDirname.account({ accountId }),
			itemKeyToDirname.strategy(strategyKey)
		]),
	day: ({ day }: DayKey) => {
		const [yyyy, mm, dd] = splitDay(day)
		return dirJoin([`y=${yyyy}`, `m=${mm}`, `d=${dd}`])
	},
	strategy: ({ strategyId, strategyKind }: StrategyKey) =>
		dirJoin([
			fieldJoin("strategyKind", strategyKind),
			fieldJoin("strategyId", strategyId)
		]),
	strategyDailyBalanceChanges: ({
		day,
		...key
	}: StrategyDailyBalanceChangesKey) =>
		dirJoin([
			itemKeyToDirname.day({ day }),
			itemKeyToDirname.accountStrategy(key)
		]),
	strategyDailyOrders: ({ day, ...key }: StrategyDailyOrdersKey) =>
		dirJoin([
			itemKeyToDirname.day({ day }),
			itemKeyToDirname.accountStrategy(key)
		]),
	subscriptionPurchase: ({
		accountId,
		day,
		purchaseId
	}: SubscriptionPurchaseKey) =>
		dirJoin([
			itemKeyToDirname.account({ accountId }),
			itemKeyToDirname.day({ day }),
			fieldJoin("purchaseId", purchaseId)
		])
}

const dirname = {
	account: (arg: AccountKey) =>
		dirJoin([
			`${dirnamePrefix.account}`,
			`${itemKeyToDirname.account(arg)}`
		]),
	accountConfig: (arg: AccountKey) =>
		dirJoin([dirnamePrefix.accountConfig, itemKeyToDirname.account(arg)]),
	accountDailyOrders: (arg: AccountDailyOrdersKey) =>
		dirJoin([
			dirnamePrefix.accountDailyOrders,
			itemKeyToDirname.accountDailyOrders(arg)
		]),
	accountStrategies: (arg: AccountKey) =>
		dirJoin([
			dirnamePrefix.accountStrategies,
			itemKeyToDirname.account(arg)
		]),
	email: (arg: EmailAddress) =>
		dirJoin(normalizeEmailAddress(arg).split("@").reverse()),
	strategy: (arg: StrategyKey) =>
		dirJoin([dirnamePrefix.strategy, itemKeyToDirname.strategy(arg)]),
	strategyDailyBalanceChanges: (arg: StrategyDailyBalanceChangesKey) =>
		dirJoin([
			dirnamePrefix.strategyDailyBalanceChanges,
			itemKeyToDirname.strategyDailyBalanceChanges(arg)
		]),
	strategyDailyOrders: (arg: StrategyDailyOrdersKey) =>
		dirJoin([
			dirnamePrefix.strategyDailyOrders,
			itemKeyToDirname.strategyDailyOrders(arg)
		]),
	strategyExecution: (arg: AccountStrategyKey) =>
		dirJoin([
			dirnamePrefix.strategyExecution,
			itemKeyToDirname.accountStrategy(arg)
		]),
	strategyFlow: (arg: StrategyKey) =>
		dirJoin([dirnamePrefix.strategyFlow, itemKeyToDirname.strategy(arg)]),
	strategyOrdersPool: (arg: StrategyKey) =>
		dirJoin([
			dirnamePrefix.strategyOrdersPool,
			itemKeyToDirname.strategy(arg)
		]),
	subscription: (arg: AccountKey) =>
		dirJoin([
			`${dirnamePrefix.subscription}`,
			`${itemKeyToDirname.account(arg)}`
		]),
	subscriptionPurchase: (arg: SubscriptionPurchaseKey) =>
		dirJoin([
			`${dirnamePrefix.subscriptionPurchase}`,
			`${itemKeyToDirname.subscriptionPurchase(arg)}`
		])
}

const filename = {
	account: "account.json",
	accountDailyOrders: "orders.json",
	accountStrategies: "strategies.json",
	binanceApiConfig: "binance.json",
	emailAccount: "email.json",
	oneTimePassword: "otp.json",
	strategy: "strategy.json",
	strategyDailyBalanceChanges: "balances.json",
	strategyDailyOrders: "orders.json",
	strategyExecution: "execution.json",
	strategyFlow: "flow.json",
	strategyOrdersPool: "orders.json",
	subscription: "subscription.json",
	subscriptionPurchase: "purchases.json"
}

export const pathname = {
	account: (arg: AccountKey) =>
		dirJoin([dirname.account(arg), filename.account]),
	accountDailyOrders: (arg: AccountDailyOrdersKey) =>
		dirJoin([dirname.accountDailyOrders(arg), filename.accountDailyOrders]),
	accountStrategies: (arg: AccountKey) =>
		dirJoin([dirname.accountStrategies(arg), filename.accountStrategies]),
	binanceApiConfig: (arg: AccountKey) =>
		dirJoin([dirname.accountConfig(arg), filename.binanceApiConfig]),
	emailAccount: (arg: EmailAddress) =>
		dirJoin([
			dirnamePrefix.emailAccount,
			dirname.email(arg),
			filename.emailAccount
		]),
	oneTimePassword: (arg: EmailAddress) =>
		dirJoin([
			dirnamePrefix.oneTimePassword,
			dirname.email(arg),
			filename.oneTimePassword
		]),
	strategy: (arg: StrategyKey) =>
		dirJoin([dirname.strategy(arg), filename.strategy]),
	strategyDailyBalanceChanges: (arg: StrategyDailyBalanceChangesKey) =>
		dirJoin([
			dirname.strategyDailyBalanceChanges(arg),
			filename.strategyDailyBalanceChanges
		]),
	strategyDailyOrders: (arg: StrategyDailyOrdersKey) =>
		dirJoin([
			dirname.strategyDailyOrders(arg),
			filename.strategyDailyOrders
		]),
	strategyExecution: (arg: AccountStrategyKey) =>
		dirJoin([dirname.strategyExecution(arg), filename.strategyExecution]),
	strategyFlow: (arg: StrategyKey) =>
		dirJoin([dirname.strategyFlow(arg), filename.strategyFlow]),
	strategyOrdersPool: (arg: AccountStrategyKey) =>
		dirJoin([dirname.strategyOrdersPool(arg), filename.strategyOrdersPool]),
	subscription: (arg: AccountKey) =>
		dirJoin([dirname.subscription(arg), filename.subscription]),
	subscriptionPurchase: (arg: SubscriptionPurchaseKey) =>
		dirJoin([
			dirname.subscriptionPurchase(arg),
			filename.subscriptionPurchase
		])
}
