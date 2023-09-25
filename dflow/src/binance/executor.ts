import { Balance, Order } from "@workspace/models"
import { DflowNodesCatalog } from "dflow"

import {
	DflowCommonExecutorContext,
	DflowCommonExecutorOutput,
	DflowExecutor,
	DflowExecutorView
} from "../common/executor.js"
import { DflowBinanceClient } from "./client.js"
import { DflowBinanceContext } from "./context.js"
import {
	getBalancesFromExecutionSteps,
	getOrdersFromExecutionSteps
} from "./execution.js"
import { DflowBinanceHost } from "./host.js"
import { DflowBinanceSymbolInfo } from "./symbols.js"

type DflowBinanceExecutorOutput = DflowCommonExecutorOutput & {
	balances: Balance[]
	orders: Pick<Order, "info">[]
}

export class DflowBinanceExecutor
	implements
		DflowExecutor<DflowCommonExecutorContext, DflowBinanceExecutorOutput>
{
	constructor(
		readonly binance: DflowBinanceClient,
		readonly binanceSymbols: DflowBinanceSymbolInfo[],
		readonly nodesCatalog: DflowNodesCatalog
	) {}

	/** Execute flow on given context. */
	async run(context: DflowCommonExecutorContext, view: DflowExecutorView) {
		const { binance, binanceSymbols, nodesCatalog } = this
		const dflow = new DflowBinanceHost(
			{ nodesCatalog },
			{ binance, ...context }
		)
		dflow.load(view)
		await dflow.run()
		const execution = dflow.executionReport
		const { memory, memoryChanged } = dflow.context as Pick<
			DflowBinanceContext,
			"memory" | "memoryChanged"
		>
		const balances = execution
			? getBalancesFromExecutionSteps(binanceSymbols, execution.steps)
			: []
		const orders = execution
			? getOrdersFromExecutionSteps(execution.steps).map((info) => ({
					info
			  }))
			: []
		return { balances, execution, memory, memoryChanged, orders }
	}
}
