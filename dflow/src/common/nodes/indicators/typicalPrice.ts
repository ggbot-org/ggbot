import { DflowNode } from 'dflow'

import { add, div } from '../arithmetic.js'
import { inputClose, inputHigh, inputLow, outputLastValue, outputValues } from '../commonIO.js'

export function typicalPrice(high: number, low: number, close: number): number {
	const sum = add(add(high, low), close)
	return div(sum, 3) as number
}

export class TypicalPrice extends DflowNode {
	static kind = 'typicalPrice'
	static inputs = [inputHigh, inputLow, inputClose]
	static outputs = [outputValues, outputLastValue]
	run() {
		const high = this.input(0).data as number[]
		const low = this.input(1).data as number[]
		const close = this.input(2).data as number[]
		const size = high.length
		if (close.length !== size || low.length !== size) return this.clearOutputs()
		const result: number[] = []
		for (let i = 0; i < size; i++) result.push(typicalPrice(high[i], low[i], close[i]))
		this.output(0).data = result
		this.output(1).data = result.slice(-1).pop()
	}
}
