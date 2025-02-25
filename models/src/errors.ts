import { AccountKey } from './account.js'
import { QuotaType } from './quotas.js'
import { Strategy, StrategyKey } from './strategy.js'

export class ErrorAccountItemNotFound extends Error {
	static errorName = 'ErrorAccountItemNotFound'
	readonly type: 'Account' | 'BinanceApiConfig' | 'SubscriptionPurchase'
	readonly accountId: AccountKey['accountId']
	constructor({
		type,
		accountId,
	}: Pick<ErrorAccountItemNotFound, 'type' | 'accountId'>) {
		super(ErrorAccountItemNotFound.message({ type, accountId }))
		this.type = type
		this.accountId = accountId
	}
	static message({
		type,
		accountId,
	}: Pick<ErrorAccountItemNotFound, 'type' | 'accountId'>) {
		return `${type} not found, accountId=${accountId}`
	}
	toJSON() {
		return {
			name: ErrorAccountItemNotFound.errorName,
			info: {
				accountId: String(this.accountId),
				type: this.type,
			},
		}
	}
}

export class ErrorExceededQuota extends Error {
	static errorName = 'ErrorExceededQuota'
	readonly type: QuotaType
	constructor({ type }: Pick<ErrorExceededQuota, 'type'>) {
		super(ErrorExceededQuota.message(type))
		this.type = type
	}
	static message(type: ErrorExceededQuota['type']) {
		return `${type} quota exceeded`
	}
	toJSON() {
		return {
			name: ErrorExceededQuota.errorName,
			info: {
				type: this.type,
			},
		}
	}
}

export class ErrorInvalidArg extends Error {
	static errorName = 'ErrorInvalidArg'
	readonly arg: unknown
	readonly type: 'EmailAddress' | 'Name'
	constructor({ arg, type }: Pick<ErrorInvalidArg, 'arg' | 'type'>) {
		super(ErrorInvalidArg.message(type))
		this.arg = arg
		this.type = type
	}
	static message(type: ErrorInvalidArg['type']) {
		return `Invalid ${type}`
	}
}

export class ErrorStrategyItemNotFound extends Error {
	static errorName = 'ErrorStrategyItemNotFound'
	readonly type: 'Strategy' | 'StrategyFlow'
	readonly strategyKind: unknown
	readonly strategyId: Strategy['id']
	constructor({
		type,
		strategyKind,
		strategyId,
	}: Pick<ErrorStrategyItemNotFound, 'type' | 'strategyKind' | 'strategyId'>) {
		super(ErrorStrategyItemNotFound.message({ type, strategyId }))
		this.type = type
		this.strategyKind = strategyKind
		this.strategyId = strategyId
	}
	static message({
		type,
		strategyId,
	}: Pick<ErrorStrategyItemNotFound, 'type' | 'strategyId'>) {
		return `${type} not found, strategyId=${strategyId}`
	}
}

export class ErrorPermissionOnStrategyItem extends Error {
	static errorName = 'ErrorPermissionOnStrategyItem'
	readonly accountId: AccountKey['accountId']
	readonly strategyKind: StrategyKey['strategyKind']
	readonly strategyId: StrategyKey['strategyId']
	readonly action: 'delete' | 'read' | 'write'
	readonly type: 'Strategy' | 'StrategyFlow'
	constructor({
		accountId,
		action,
		strategyKind,
		strategyId,
		type,
	}: Pick<
		ErrorPermissionOnStrategyItem,
		'accountId' | 'action' | 'type' | 'strategyKind' | 'strategyId'
	>) {
		super(ErrorPermissionOnStrategyItem.message({ action, type }))
		this.accountId = accountId
		this.action = action
		this.type = type
		this.strategyKind = strategyKind
		this.strategyId = strategyId
	}
	static message({
		action,
		type,
	}: Pick<ErrorPermissionOnStrategyItem, 'action' | 'type'>) {
		return `Cannot ${action} ${type}`
	}
}

/**
 * An error that should be never thrown.
 *
 * @example
 *
 * ```ts
 * type ItemName = "foo" | "bar"
 *
 * function handleItem(item: ItemName) {
 * 	if (item === "foo") doSomething()
 * 	if (item === "bar") doSomethingElse()
 *
 * 	// This code should never run.
 * 	throw new ErrorUnknownItem("item", item)
 * }
 * ```
 */
export class ErrorUnknownItem extends Error {
	static errorName = 'ErrorUnknownItem'
	readonly itemName: string
	readonly itemType: string
	constructor(itemType: string, itemName: never) {
		super(`Unknown ${itemType} ${String(itemName)}`)
		this.itemName = String(itemName)
		this.itemType = itemType
	}
	toJSON() {
		return {
			name: ErrorUnknownItem.errorName,
			info: { itemName: this.itemName, itemType: this.itemType },
		}
	}
}
