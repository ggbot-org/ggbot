import { DflowNode } from "dflow"

import { add, div, MaybeNumber } from "../arithmetic.js"
import {
	inputClose,
	inputHigh,
	inputLow,
	inputOpen,
	outputClose,
	outputOpen
} from "../commonIO.js"

/**
 * Heikin-Ashi is a Japanese trading indicator that means "average pace".
 *
 * @see {@link https://en.wikipedia.org/wiki/Heikin-Ashi_chart|Heikin-Ashi chart on Wikipedia}
 */
export class HeikinAshi extends DflowNode {
	static kind = "Heikin-Ashi"
	static inputs = [inputOpen, inputHigh, inputLow, inputClose]
	static outputs = [outputOpen, outputClose]
	run() {
		const open = this.input(0).data as number[]
		const high = this.input(1).data as number[]
		const low = this.input(2).data as number[]
		const close = this.input(3).data as number[]
		const size = open.length
		if (
			high.length !== size ||
			close.length !== size ||
			low.length !== size
		) {
			this.clearOutputs()
			return
		}
		const openOutput: MaybeNumber[] = []
		const closeOutput: MaybeNumber[] = []
		for (let i = 1; i < size; i++) {
			const heikinAshiOpen = div(add(open[i], close[i]), 2)
			openOutput.push(heikinAshiOpen)
			const heikinAshiClose = div(
				add(add(add(open[i], high[i]), low[i]), close[i]),
				4
			)
			closeOutput.push(heikinAshiClose)
		}
		this.output(0).data = openOutput
		this.output(1).data = closeOutput
	}
}
