import { Dflow, DflowNode } from 'dflow'

import { div, mul, sub } from './arithmetic.js'
import { outputLastValue, outputValues } from './commonIO.js'

const { input } = Dflow

export class DeltaPercentage extends DflowNode {
	static kind = 'deltaPercentage'
	static inputs = [input('array', { name: 'a' }), input('array', { name: 'b' })]
	static outputs = [outputValues, outputLastValue]
	run() {
		const arrayA = (this.input(0).data as unknown[]).slice(0)
		const arrayB = (this.input(1).data as unknown[]).slice(0)
		const values: number[] = []
		for (let i = 0; i < arrayA.length; i++) {
			const valueA = arrayA[i]
			if (!Dflow.isNumber(valueA)) continue
			const valueB = arrayB[i]
			if (!Dflow.isNumber(valueB)) continue
			const value = mul(div(sub(valueB, valueA), valueA), 100)
			if (value === undefined) return this.clearOutputs()
			values.push(Number(value.toFixed(2)))
		}
		if (!values.length) return this.clearOutputs()
		this.output(0).data = values
		this.output(1).data = values[values.length - 1]
	}
}
