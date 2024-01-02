import { CacheMap } from "@workspace/cache"
import {
	Account,
	CopyStrategy,
	CreateStrategy,
	DeleteStrategy,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	newAccountStrategy,
	newStrategy,
	normalizeName,
	ReadStrategy,
	ReadStrategyAccountId,
	RenameStrategy,
	Strategy,
	StrategyKey,
	throwIfInvalidName,
	UpsertStrategyFrequency
} from "@workspace/models"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
import {
	deleteAccountStrategiesItem,
	insertAccountStrategiesItem,
	renameAccountStrategiesItem
} from "./accountStrategies.js"
import { pathname } from "./locators.js"
import { copyStrategyFlow, deleteStrategyFlow } from "./strategyFlow.js"

const strategyAccountIdCache = new CacheMap<Account["id"]>()

export const createStrategy: CreateStrategy = async ({
	accountId,
	kind,
	name
}) => {
	throwIfInvalidName(name)
	const strategy = newStrategy({
		kind,
		name,
		accountId
	})
	const strategyKey = { strategyId: strategy.id, strategyKind: kind }
	await WRITE(pathname.strategy(strategyKey), strategy)
	const accountStrategy = newAccountStrategy({ name, ...strategyKey })
	await insertAccountStrategiesItem({ accountId, item: accountStrategy })
	return strategy
}

export const copyStrategy: CopyStrategy = async ({
	accountId,
	name,
	...strategyKey
}) => {
	const strategy = await createStrategy({
		accountId,
		kind: strategyKey.strategyKind,
		name
	})

	await copyStrategyFlow({
		accountId,
		source: strategyKey,
		target: {
			strategyId: strategy.id,
			strategyKind: strategy.kind
		}
	})

	return strategy
}

export const readStrategy: ReadStrategy = (arg) =>
	READ<ReadStrategy>(pathname.strategy(arg))

const readStrategyOrThrow = async (
	strategyKey: StrategyKey
): Promise<Strategy> => {
	const data = await readStrategy(strategyKey)
	if (!data)
		throw new ErrorStrategyItemNotFound({
			type: "Strategy",
			...strategyKey
		})
	return data
}

/** Get `accountId` of strategy. */
export const readStrategyAccountId: ReadStrategyAccountId = async (
	strategyKey
) => {
	const { strategyId } = strategyKey
	const cachedData = strategyAccountIdCache.get(strategyId)
	if (cachedData) return cachedData
	const { accountId } = await readStrategyOrThrow(strategyKey)
	strategyAccountIdCache.set(strategyId, accountId)
	return accountId
}

export const renameStrategy: RenameStrategy = async ({
	accountId,
	name,
	...strategyKey
}) => {
	throwIfInvalidName(name)
	const strategy = await readStrategyOrThrow(strategyKey)
	const normalizedName = normalizeName(name)
	const { strategyId } = strategyKey
	if (strategy.accountId === accountId) {
		const renamedStrategy = { ...strategy, name: normalizedName }
		await WRITE(pathname.strategy(strategyKey), renamedStrategy)
	}
	return await renameAccountStrategiesItem({
		accountId,
		strategyId,
		name: normalizedName
	})
}

export const deleteStrategy: DeleteStrategy = async (accountStrategyKey) => {
	const { accountId, ...strategyKey } = accountStrategyKey
	const ownerId = await readStrategyAccountId(strategyKey)
	if (accountId !== ownerId)
		throw new ErrorPermissionOnStrategyItem({
			action: "delete",
			type: "Strategy",
			accountId,
			...strategyKey
		})
	await DELETE(pathname.strategy(strategyKey))
	await deleteStrategyFlow(accountStrategyKey)
	return await deleteAccountStrategiesItem(accountStrategyKey)
}

export const upsertStrategyFrequency: UpsertStrategyFrequency = async ({
	frequency,
	...strategyKey
}) => {
	const strategy = await readStrategyOrThrow(strategyKey)
	const previousFrequency = strategy.frequency
	if (
		!previousFrequency ||
		(previousFrequency.every !== frequency.every &&
			previousFrequency.interval !== frequency.interval)
	)
		await WRITE(pathname.strategy(strategyKey), { ...strategy, frequency })
}
