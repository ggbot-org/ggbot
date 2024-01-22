import {
	PublicApiDataProviderOperation as PublicOperation,
	UserApiDataProviderOperation as UserOperation
} from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import {
	Account,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	frequenciesAreEqual,
	Frequency,
	newAccountStrategy,
	newStrategy,
	normalizeName,
	Strategy,
	StrategyKey,
	throwIfInvalidName
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

export const createStrategy: UserOperation["CreateStrategy"] = async ({
	accountId,
	name,
	...rest
}) => {
	throwIfInvalidName(name)
	const strategy = newStrategy({
		accountId,
		name,
		...rest
	})
	const strategyKey = { strategyId: strategy.id, strategyKind: strategy.kind }
	await WRITE(pathname.strategy(strategyKey), strategy)
	const accountStrategy = newAccountStrategy({ name, ...strategyKey })
	await insertAccountStrategiesItem({ accountId, item: accountStrategy })
	return strategy
}

export const copyStrategy: UserOperation["CopyStrategy"] = async ({
	accountId,
	strategyId,
	strategyKind,
	name
}) => {
	const sourceStrategy = await readStrategyOrThrow({
		strategyId,
		strategyKind
	})

	const strategy = await createStrategy({
		accountId,
		kind: strategyKind,
		name,
		frequency: sourceStrategy.frequency
	})

	await copyStrategyFlow({
		accountId,
		source: { strategyId, strategyKind },
		target: {
			strategyId: strategy.id,
			strategyKind: strategy.kind
		}
	})

	return strategy
}

export const readStrategy: PublicOperation["ReadStrategy"] = (arg) =>
	READ<PublicOperation["ReadStrategy"]>(pathname.strategy(arg))

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
export const readStrategyAccountId = async (
	strategyKey: StrategyKey
): Promise<Account["id"] | null> => {
	const { strategyId } = strategyKey
	const cachedData = strategyAccountIdCache.get(strategyId)
	if (cachedData) return cachedData
	const { accountId } = await readStrategyOrThrow(strategyKey)
	strategyAccountIdCache.set(strategyId, accountId)
	return accountId
}

export const renameStrategy: UserOperation["RenameStrategy"] = async ({
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

export const deleteStrategy: UserOperation["DeleteStrategy"] = async (
	accountStrategyKey
) => {
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

export const upsertStrategyFrequency = async ({
	frequency,
	...strategyKey
}: StrategyKey & { frequency: Frequency }): Promise<void> => {
	const strategy = await readStrategyOrThrow(strategyKey)
	if (frequenciesAreEqual(frequency, strategy.frequency)) return
	await WRITE(pathname.strategy(strategyKey), { ...strategy, frequency })
}
