import { StrategyFlowGraph } from "@workspace/models"
import { Dflow, DflowConstructorArg } from "dflow"

import { DflowLoader, load } from "../common/loader.js"
import { DflowBinanceContext } from "./context.js"
import { binanceNodeTextToDflowKind } from "./nodeResolution.js"

/**
 * `DflowBinanceHost` extends `DflowHost` adding DflowCommonContext and an
 * instance of Binance client.
 */
export class DflowBinanceHost extends Dflow implements DflowLoader {
	constructor(
		arg: DflowConstructorArg,
		context: Omit<DflowBinanceContext, "memoryChanged">
	) {
		super(arg)
		this.context.binance = context.binance
		this.context.params = context.params
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time
	}

	load(graph: StrategyFlowGraph): void {
		load({
			dflow: this,
			nodeTextToDflowKind: binanceNodeTextToDflowKind,
			graph
		})
	}
}
