import {Dflow} from 'dflow'
import {load} from './loader.js'

/** @typedef {import('./context').DflowCommonContext} DflowCommonContext */

/** @typedef {import('./loader').DflowLoader} DflowLoader */

/** @implements {DflowLoader} */
export class DflowCommonHost extends Dflow {
	/**
	 * @param {ConstructorParameters<typeof Dflow>[0]} arg
	 * @param {DflowCommonContext} context
	 */
	constructor(arg, context) {
		super(arg)
		this.context.defaults = context.defaults
		this.context.params = context.params
		this.context.memory = context.memory
		this.context.memoryChanged = false
		this.context.time = context.time
	}
	/** @type {import('./host').DflowCommonHost['load']} */
	load(graph) {
		load({dflow: this, graph})
	}
}
