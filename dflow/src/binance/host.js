import { Dflow } from 'dflow'

import { load } from '../common/loader.js'

/** @typedef {import('../common/loader').DflowLoader} DflowLoader */

/** @implements {DflowLoader} */
export class DflowBinanceHost extends Dflow {
	/**
	 * @param {ConstructorParameters<typeof import('./host').DflowBinanceHost>[0]} arg
	 * @param {ConstructorParameters<typeof import('./host').DflowBinanceHost>[1]} context
	 */
	constructor(arg, context) {
		super(arg)
		this.context.binance = context.binance
		this.context.defaults = context.defaults
		this.context.params = context.params
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time
	}

	/** @type {import('./host').DflowBinanceHost['load']} */
	load(graph) {
		load({ dflow: this, graph })
	}
}
