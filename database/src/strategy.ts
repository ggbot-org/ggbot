import {
	Account,
	ErrorPermissionOnStrategyItem,
	frequenciesAreEqual,
	Frequency,
	newAccountStrategy,
	newStrategy,
	normalizeName,
	StrategyKey,
	throwIfInvalidName
} from "@workspace/models"

import { DELETE, WRITE } from "./_dataBucket.js"
import {
	insertAccountStrategiesItem,
	renameAccountStrategiesItem
} from "./accountStrategies.js"
import { pathname } from "./locators.js"

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

export const upsertStrategyFrequency = async ({
	frequency,
	...strategyKey
}: StrategyKey & { frequency: Frequency }): Promise<void> => {
	const strategy = await readStrategyOrThrow(strategyKey)
	if (frequenciesAreEqual(frequency, strategy.frequency)) return
	await WRITE(pathname.strategy(strategyKey), { ...strategy, frequency })
}
