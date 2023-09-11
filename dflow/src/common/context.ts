import { DflowObject } from "dflow"
import { Time } from "minimal-time-helpers"

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
	/** Used by input nodes: `InputBoolean`, `InputNumber`, `InputString`, etc. */
	input: DflowObject
	/** Used by memory nodes: `GetMemory`, `SetMemory`, `DeleteMemory`. */
	memory: DflowObject
	/**
	 * The `memoryChanged` attribute is set to true by memory nodes every time
	 * there is a change (e.g. update or delete) in memory.
	 */
	memoryChanged?: undefined | boolean
	/** Time related nodes read the `time` value. */
	time: Time
}
