import { DflowNode } from 'dflow'

import {
	inputValues1,
	inputValues2,
	outputLastValue,
	outputValues,
} from '../commonIO.js'

export function crossOver(values1: number[], values2: number[]): number[] {
	const result: number[] = []
	const size = values1.length
	for (let index = 1; index < size; index++) {
		const current1 = values1[index]
		const current2 = values2[index]
		const previous1 = values1[index - 1]
		const previous2 = values2[index - 1]
		if (current1 > current2 && previous1 <= previous2) {
			result.push(1)
		} else if (current1 < current2 && previous1 >= previous2) {
			result.push(-1)
		} else {
			result.push(0)
		}
	}
	return result
}

export class CrossOver extends DflowNode {
	static kind = 'crossOver'
	static inputs = [inputValues1, inputValues2]
	static outputs = [outputValues, outputLastValue]
	run() {
		const values1 = this.input(0).data as number[]
		const values2 = this.input(1).data as number[]
		const result = crossOver(values1, values2)
		this.output(0).data = result
		this.output(1).data = result.slice(-1).pop()
	}
}
