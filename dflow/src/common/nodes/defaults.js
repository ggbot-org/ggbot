import { DflowNode } from 'dflow'

import { inputSymbol } from './commonIO.js'

export class DefaultSymbol extends DflowNode {
	static kind = 'defaultSymbol'
	static inputs = [inputSymbol]
	static outputs = /** @type {never[]} */ ([])
	run () {
		// This node does not run any code.
		// It is used by `extractsBinanceDefaultsFromFlow`.
	}
}
