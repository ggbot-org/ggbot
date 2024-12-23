import { isNonEmptyString } from '@workspace/models'
import { DflowNode } from 'dflow'

import { inputDefaultParameter, inputInterval, inputKey, outputInterval, outputSymbol } from '../../common/nodes/commonIO.js'

/** @typedef {import('../context').DflowBinanceContext} Context */

export class SymbolParameter extends DflowNode {
	static kind = 'symbolParameter'
	static inputs = [inputKey, inputDefaultParameter('string')]
	static outputs = [outputSymbol]
	run() {
		const { params } = /** @type {Context} */ (this.host.context)
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (!isNonEmptyString(key) || !isNonEmptyString(defaultValue)) return this.clearOutputs()
		let value = defaultValue
		const inputValue = params[key]
		if (isNonEmptyString(inputValue)) value = inputValue
		this.output(0).data = value
	}
}

export class IntervalParameter extends DflowNode {
	static kind = 'intervalParameter'
	static inputs = [inputKey, inputInterval]
	static outputs = [outputInterval]
	run() {
		const { params } = /** @type {Context} */ (this.host.context)
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (!isNonEmptyString(key) || !isNonEmptyString(defaultValue)) return this.clearOutputs()
		let value = defaultValue
		const inputValue = params[key]
		if (isNonEmptyString(inputValue)) value = inputValue
		this.output(0).data = value
	}
}
