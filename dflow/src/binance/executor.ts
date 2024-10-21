import { Balance, Order, StrategyFlowGraph } from "@workspace/models"
import { DflowNodesCatalog } from "dflow"

import { DflowCommonExecutorContext, DflowCommonExecutorOutput, DflowExecutor } from "../common/executor.js"
import { DflowBinanceClient } from "./client.js"
import { DflowBinanceContext } from "./context.js"
import { getBalanceFromExecutionSteps, getOrdersFromExecutionSteps } from "./execution.js"
import { extractsBinanceDefaultsFromFlow } from "./flow.js"
import { DflowBinanceHost } from "./host.js"

type DflowBinanceExecutorOutput = DflowCommonExecutorOutput & {
	balance: Balance
	orders: Array<Pick<Order, "info">>
}

type DflowBinanceExecutorContext = DflowCommonExecutorContext & {
	binance: DflowBinanceClient
}

export class DflowBinanceExecutor implements DflowExecutor<DflowBinanceExecutorContext, DflowBinanceExecutorOutput> {
	nodesCatalog: DflowNodesCatalog

	constructor() {
		this.nodesCatalog = {}
	}

	/** Execute flow on given context. */
	async run(context: DflowBinanceExecutorContext, graph: StrategyFlowGraph) {
		const { nodesCatalog } = this
		const { binance } = context
		const defaults = await extractsBinanceDefaultsFromFlow(nodesCatalog, graph)
		const dflow = new DflowBinanceHost(
			{ nodesCatalog },
			{ defaults, ...context }
		)
		dflow.load(graph)
		await dflow.run()
		const execution = dflow.executionReport
		const { memory, memoryChanged } = dflow.context as Pick<
			DflowBinanceContext,
			"memory" | "memoryChanged"
		>
		const { symbols } = await binance.exchangeInfo()
		const balance = execution
			? getBalanceFromExecutionSteps(symbols, execution.steps)
			: []
		const orders = execution
			? getOrdersFromExecutionSteps(execution.steps).map((info) => ({ info }))
			: []
		return { balance, execution, memory, memoryChanged, orders }
	}
}
