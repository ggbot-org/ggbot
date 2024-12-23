import { isIdentifierString, isSerializablePrimitive } from '@workspace/models'
import { Dflow, DflowNode } from 'dflow'

import { DflowCommonContext as Context } from '../context.js'
import { inputKey } from './commonIO.js'

const { input, output } = Dflow

export class DeleteMemory extends DflowNode {
	static kind = 'deleteMemory'
	static inputs = [inputKey]
	run() {
		const context = this.host.context as Context
		const key = this.input(0).data
		if (!isIdentifierString(key)) return
		const value = context.memory[key]
		if (value === undefined) return
		delete context.memory[key]
		context.memoryChanged = true
	}
}

export class GetMemory extends DflowNode {
	static kind = 'getMemory'
	static inputs = [inputKey, input([], { name: 'default', optional: true })]
	static outputs = [output([], { name: 'value' })]
	run() {
		const context = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (!isIdentifierString(key)) return
		const value = context.memory[key]
		if (value === undefined) {
			if (!isSerializablePrimitive(defaultValue)) return this.clearOutputs()
			this.output(0).data = defaultValue
		} else {
			if (!isSerializablePrimitive(value)) return this.clearOutputs()
			this.output(0).data = value
		}
	}
}

export class SetMemory extends DflowNode {
	static kind = 'setMemory'
	static inputs = [inputKey, input([], { name: 'value' })]
	run() {
		const context = this.host.context as Context
		const key = this.input(0).data
		if (!isIdentifierString(key)) return
		const value = this.input(1).data
		if (!isSerializablePrimitive(value)) return
		const previousValue = context.memory[key]
		if (Object.is(value, previousValue)) return
		context.memoryChanged = true
		context.memory[key] = value
	}
}
