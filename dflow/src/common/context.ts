import { StrategyMemory, StrategyParameters } from '@workspace/models'
import { Time } from 'minimal-time-helpers'

/**
 * DflowCommonContext to be shared among all dflow host implementations.
 *
 * @example
 *
 * ```ts
 * import { DflowHost, DflowHostConstructorArg } from "dflow"
 * import { DflowCommonContext } from "@workspace/dflow"
 *
 * export class MyDflowHost extends DflowHost {
 * 	constructor(arg: DflowHostConstructorArg) {
 * 		super(arg)
 *
 * 		const input: DflowCommonContext["input"] = {}
 * 		this.context.input = input
 *
 * 		const memory: DflowCommonContext["memory"] = {}
 * 		this.context.memory = memory
 * 	}
 * }
 * ```
 */
export type DflowCommonContext = {
	/** Used by any node that as `inputSymbol`. */
	defaults: {
		symbol?: string
	}
	/** Used by parameter nodes: `BooleanParameter`, `NumberParameter`, etc. */
	params: StrategyParameters
	/** Used by memory nodes: `GetMemory`, `SetMemory`, `DeleteMemory`. */
	memory: StrategyMemory
	/**
	 * The `memoryChanged` attribute is set to true by memory nodes every time
	 * there is a change (e.g. update or delete) in memory.
	 */
	memoryChanged?: undefined | boolean
	/** Used by time nodes: `timeMinus`, `timePlus`, `today`, etc. */
	time: Time
}
