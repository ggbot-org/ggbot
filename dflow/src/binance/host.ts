import { StrategyFlowGraph } from "@workspace/models"
import { Dflow } from "dflow"

import { DflowLoader, load } from "../common/loader.js"
import { DflowBinanceContext } from "./context.js"

/**
 * `DflowBinanceHost` extends `DflowHost` adding an instance of Binance client to the context.
 */
export class DflowBinanceHost extends Dflow implements DflowLoader {
	constructor(
		arg: ConstructorParameters<typeof Dflow>[0],
		context: Omit<DflowBinanceContext, "memoryChanged">
	) {
		super(arg)
		this.context.binance = context.binance
		this.context.defaults = context.defaults
		this.context.params = context.params
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time
	}

	load(graph: StrategyFlowGraph): void {
		load({ dflow: this, graph })
	}
}
