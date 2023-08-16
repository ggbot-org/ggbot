import { now, truncateTime } from "@ggbot2/time"
import { DflowHost, DflowHostConstructorArg } from "dflow"

import { DflowExecutorView } from "../common/executor.js"
import { DflowLoader, load } from "../common/loader.js"
import { BinanceDflowContext } from "./context.js"
import { binanceNodeTextToDflowKind } from "./nodeResolution.js"

/**
 * `BinanceDflowHost` extends `DflowHost` adding ggbot2 DflowCommonContext and
 * an instance of Binance client.
 */
export class BinanceDflowHost extends DflowHost implements DflowLoader {
	constructor(
		arg: DflowHostConstructorArg,
		context: BinanceDflowHostContextArg
	) {
		super(arg)
		this.context.binance = context.binance
		this.context.input = context.input
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time ?? truncateTime(now()).to.minute()
	}

	load(view: DflowExecutorView): void {
		load({
			dflow: this,
			nodeTextToDflowKind: binanceNodeTextToDflowKind,
			view
		})
	}
}

export type BinanceDflowHostContextArg = Omit<
	BinanceDflowContext,
	"memoryChanged"
>
