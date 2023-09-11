import {
	DeleteStrategyMemory,
	isStrategyMemory,
	ReadStrategyMemory,
	StrategyMemory,
	updatedNow,
	WriteStrategyMemory
} from "@workspace/models"

import { DELETE, READ, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readStrategyMemory: ReadStrategyMemory = (arg) =>
	READ<ReadStrategyMemory>(isStrategyMemory, pathname.strategyMemory(arg))

export const writeStrategyMemory: WriteStrategyMemory = async ({
	accountId,
	strategyKind,
	strategyId,
	...rest
}) => {
	const whenUpdated = updatedNow()
	const data: StrategyMemory = {
		...rest,
		...whenUpdated
	}
	return UPDATE(
		pathname.strategyMemory({
			accountId,
			strategyKind,
			strategyId
		}),
		data
	)
}

export const deleteStrategyMemory: DeleteStrategyMemory = (arg) =>
	DELETE(pathname.strategyMemory(arg))
