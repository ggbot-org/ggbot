import { Dflow, DflowNode } from 'dflow'

import { inputArray } from './commonIO.js'

const { input, output } = Dflow

const inputElement = input([], { name: 'element' })
const outputElement = output([], { name: 'element' })
const outputRest = output('array', { name: 'rest' })

export class Shift extends DflowNode {
	static kind = 'shift'
	static inputs = [inputArray]
	static outputs = [outputElement, outputRest]
	run() {
		const array = (this.input(0).data as unknown[]).slice(0)
		this.output(0).data = array.shift()
		this.output(1).data = array
	}
}

export class Pop extends DflowNode {
	static kind = 'pop'
	static inputs = [inputArray]
	static outputs = [outputElement, outputRest]
	run() {
		const array = (this.input(0).data as unknown[]).slice(0)
		this.output(0).data = array.pop()
		this.output(1).data = array
	}
}

export class Push extends DflowNode {
	static kind = 'push'
	static inputs = [
		input('array', { name: 'array', optional: true }),
		inputElement
	]
	static outputs = [outputElement, outputRest]
	run() {
		const maybeArray = this.input(0).data as unknown
		const element = this.input(1).data as unknown
		// Input array is optional and defaults to an empty array.
		if (maybeArray === undefined) {
			this.output(0).data = [element]
		} else if (Array.isArray(maybeArray)) {
			const array = maybeArray.slice(0)
			array.push(element)
			this.output(0).data = array
		} else {
			this.clearOutputs()
		}
	}
}
