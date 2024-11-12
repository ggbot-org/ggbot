import { Dflow, DflowNode } from 'dflow'

import { inputArray } from './commonIO.js'

const { output } = Dflow

const arrayIsEmptyOrNoElementIsNumber = (array: unknown[]) => array.length === 0 ||
	array.every((element) => typeof element !== 'number' || isNaN(element))

export class Max extends DflowNode {
	static kind = 'max'
	static inputs = [inputArray]
	static outputs = [output('number')]
	run() {
		const array = this.input(0).data as unknown[]
		if (arrayIsEmptyOrNoElementIsNumber(array)) return this.clearOutputs()
		this.output(0).data = array.reduce<number>(
			(max, element) => typeof element === 'number' ? Math.max(max, element) : max,
			-Infinity
		)
	}
}

export class Min extends DflowNode {
	static kind = 'min'
	static inputs = [inputArray]
	static outputs = [output('number')]
	run() {
		const array = this.input(0).data as unknown[]
		if (arrayIsEmptyOrNoElementIsNumber(array)) return this.clearOutputs()
		this.output(0).data = array.reduce<number>(
			(min, element) => typeof element === 'number' ? Math.min(min, element) : min,
			Infinity
		)
	}
}
