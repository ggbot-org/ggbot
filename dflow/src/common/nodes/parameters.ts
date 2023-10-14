import {
	isStrategyParameterKey,
	isStrategyParameterNumber,
	isStrategyParameterString
} from "@workspace/models"
import { DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../context.js"
import { inputKey } from "./commonIO.js"

const { input, output } = DflowNode

export class BooleanParameter extends DflowNode {
	static kind = "booleanParameter"
	static inputs = [inputKey, input("boolean", { name: "value" })]
	static outputs = [output("boolean")]
	run() {
		const { params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (!isStrategyParameterKey(key) || typeof defaultValue !== "boolean")
			return this.clearOutputs()
		let value = defaultValue
		if (key in params) {
			const inputValue = params[key]
			if (typeof inputValue === "boolean") value = inputValue
		}
		this.output(0).data = value
	}
}

export class NumberParameter extends DflowNode {
	static kind = "numberParameter"
	static inputs = [inputKey, input("number", { name: "value" })]
	static outputs = [output("number")]
	run() {
		const { params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (
			!isStrategyParameterKey(key) ||
			!isStrategyParameterNumber(defaultValue)
		)
			return this.clearOutputs()
		let value = defaultValue
		if (key in params) {
			const inputValue = params[key]
			if (isStrategyParameterNumber(inputValue)) value = inputValue
		}
		this.output(0).data = value
	}
}

export class StringParameter extends DflowNode {
	static kind = "stringParameter"
	static inputs = [inputKey, input("string", { name: "value" })]
	static outputs = [output("string")]
	run() {
		const { params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (
			!isStrategyParameterKey(key) ||
			!isStrategyParameterString(defaultValue)
		)
			return this.clearOutputs()
		let value = defaultValue
		if (key in params) {
			const inputValue = params[key]
			if (isStrategyParameterString(inputValue)) value = inputValue
		}
		this.output(0).data = value
	}
}
