import { DflowExecutionNodeInfo, DflowGraph } from "dflow"
import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountStrategyKey } from "./accountStrategy.js"
import { Balance, isBalances } from "./balance.js"
import { DeletionTime, isUpdateTime, UpdateTime } from "./time.js"

type StrategyExecutionStatus = Extract<
	DflowGraph["runStatus"],
	"success" | "failure"
>
const isStrategyExecutionStatus = isLiteralType<StrategyExecutionStatus>([
	"success",
	"failure"
])

export type StrategyExecution = UpdateTime & {
	/**
	 * If a strategy execution do some transaction, the result can be reported
	 * as a `balances` attribute.
	 */
	balances: Balance[]

	steps: DflowExecutionNodeInfo[]

	status: StrategyExecutionStatus
}

export const isStrategyExecution = objectTypeGuard<StrategyExecution>(
	({ status, balances, steps, ...updateTime }) =>
		isUpdateTime(updateTime) &&
		isStrategyExecutionStatus(status) &&
		isBalances(balances) &&
		// TODO isDflowExecutionNodeInfo(steps)
		Array.isArray(steps)
)

export type ReadStrategyExecution = (
	arg: AccountStrategyKey
) => Promise<StrategyExecution | null>

type WriteStrategyExecutionInput = AccountStrategyKey &
	Omit<StrategyExecution, "whenUpdated">

export type WriteStrategyExecution = (
	arg: WriteStrategyExecutionInput
) => Promise<UpdateTime>

export type DeleteStrategyExecution = (
	arg: AccountStrategyKey
) => Promise<DeletionTime>
