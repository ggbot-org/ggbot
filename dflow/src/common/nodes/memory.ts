import { isStrategyMemoryKey, isStrategyMemoryValue } from "@workspace/models"
import { DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../context.js"
import { inputKey } from "./commonIO.js"

const { input, output } = DflowNode

export class DeleteMemory extends DflowNode {
	static kind = "deleteMemory"
	static inputs = [inputKey]
	async run() {
		const key = this.input(0).data
		if (!isStrategyMemoryKey(key)) return
		const value = (this.host.context as Context).memory[key]
		if (value === undefined) return
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete (this.host.context as Context).memory[key]
		;(this.host.context as Context).memoryChanged = true
	}
}

export class GetMemory extends DflowNode {
	static kind = "getMemory"
	static inputs = [inputKey]
	static outputs = [output([], { name: "value" })]
	async run() {
		const key = this.input(0).data
		if (!isStrategyMemoryKey(key)) return
		const value = (this.host.context as Context).memory[key]
		if (!isStrategyMemoryValue(value)) return this.clearOutputs()
		this.output(0).data = value
	}
}

export class SetMemory extends DflowNode {
	static kind = "setMemory"
	static inputs = [inputKey, input([], { name: "value" })]
	async run() {
		const key = this.input(0).data
		if (!isStrategyMemoryKey(key)) return
		const value = this.input(1).data
		if (!isStrategyMemoryValue(value)) return
		const previousValue = (this.host.context as Context).memory[key]
		if (Object.is(value, previousValue)) return
		;(this.host.context as Context).memoryChanged = true
		;(this.host.context as Context).memory[key] = value
	}
}
