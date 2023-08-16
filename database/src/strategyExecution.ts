import {
	DeleteStrategyExecution,
	isStrategyExecution,
	ReadStrategyExecution,
	StrategyExecution,
	updatedNow,
	WriteStrategyExecution
} from "@ggbot2/models"

import { DELETE, READ, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readStrategyExecution: ReadStrategyExecution = (arg) =>
	READ<ReadStrategyExecution>(
		isStrategyExecution,
		pathname.strategyExecution(arg)
	)

export const writeStrategyExecution: WriteStrategyExecution = async ({
	accountId,
	strategyKind,
	strategyId,
	...rest
}) => {
	const whenUpdated = updatedNow()
	const data: StrategyExecution = {
		...rest,
		...whenUpdated
	}
	await UPDATE(
		pathname.strategyExecution({
			accountId,
			strategyKind,
			strategyId
		}),
		data
	)
	return whenUpdated
}

export const deleteStrategyExecution: DeleteStrategyExecution = (arg) =>
	DELETE(pathname.strategyExecution(arg))
