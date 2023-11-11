import { DflowHost, DflowHostConstructorArg } from "dflow"

import { DflowExecutorView } from "../common/executor.js"
import { DflowLoader, load } from "../common/loader.js"
import { DflowBinanceContext } from "./context.js"
import { binanceNodeTextToDflowKind } from "./nodeResolution.js"

/**
 * `DflowBinanceHost` extends `DflowHost` adding DflowCommonContext and an
 * instance of Binance client.
 */
export class DflowBinanceHost extends DflowHost implements DflowLoader {
	constructor(
		arg: DflowHostConstructorArg,
		context: Omit<DflowBinanceContext, "memoryChanged">
	) {
		super(arg)
		this.context.binance = context.binance
		this.context.params = context.params
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time
	}

	load(view: DflowExecutorView): void {
		load({
			dflow: this,
			nodeTextToDflowKind: binanceNodeTextToDflowKind,
			view
		})
	}
}
