import { Dflow, DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../context.js"
import { inputKey } from "./commonIO.js"

const { input, output } = DflowNode

export class InputBoolean extends DflowNode {
	static kind = "inputBoolean"
	static inputs = [inputKey, input("boolean", { name: "value" })]
	static outputs = [output("boolean")]
	run() {
		const key = this.input(0).data as string
		const defaultValue = this.input(1).data as boolean
		const input = (this.host.context as Context).input
		let value = defaultValue
		if (key in input) {
			const inputValue = input[key]
			if (Dflow.isBoolean(inputValue)) value = inputValue
		}
		if (value === undefined) return this.clearOutputs()
		this.output(0).data = value
	}
}

export class InputNumber extends DflowNode {
	static kind = "inputNumber"
	static inputs = [inputKey, input("number", { name: "value" })]
	static outputs = [output("number")]
	run() {
		const key = this.input(0).data as string
		const defaultValue = this.input(1).data as number
		const input = (this.host.context as Context).input
		let value = defaultValue
		if (key in input) {
			const inputValue = input[key]
			if (Dflow.isNumber(inputValue)) value = inputValue
		}
		if (value === undefined) return this.clearOutputs()
		this.output(0).data = value
	}
}

export class InputString extends DflowNode {
	static kind = "inputString"
	static inputs = [inputKey, input("string", { name: "value" })]
	static outputs = [output("string")]
	run() {
		const key = this.input(0).data as string
		const defaultValue = this.input(1).data as string
		const input = (this.host.context as Context).input
		let value = defaultValue
		if (key in input) {
			const inputValue = input[key]
			if (Dflow.isString(inputValue)) value = inputValue
		}
		if (value === undefined) return this.clearOutputs()
		this.output(0).data = value
	}
}
