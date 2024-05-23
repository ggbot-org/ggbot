import {
	isFiniteNumber,
	isIdentifierString,
	isNonEmptyString
} from "@workspace/models"
import { Dflow, DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../context.js"
import { inputDefaultParameter, inputKey } from "./commonIO.js"

const { output } = Dflow

export class BooleanParameter extends DflowNode {
	static kind = "booleanParameter"
	static inputs = [inputKey, inputDefaultParameter("boolean")]
	static outputs = [output("boolean")]
	run() {
		const { params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (!isIdentifierString(key) || typeof defaultValue !== "boolean")
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
	static inputs = [inputKey, inputDefaultParameter("number")]
	static outputs = [output("number")]
	run() {
		const { params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (!isIdentifierString(key) || !isFiniteNumber(defaultValue))
			return this.clearOutputs()
		let value = defaultValue
		if (key in params) {
			const inputValue = params[key]
			if (isFiniteNumber(inputValue)) value = inputValue
		}
		this.output(0).data = value
	}
}

export class StringParameter extends DflowNode {
	static kind = "stringParameter"
	static inputs = [inputKey, inputDefaultParameter("string")]
	static outputs = [output("string")]
	run() {
		const { params } = this.host.context as Context
		const key = this.input(0).data
		const defaultValue = this.input(1).data
		if (!isIdentifierString(key) || !isNonEmptyString(defaultValue))
			return this.clearOutputs()
		let value = defaultValue
		if (key in params) {
			const inputValue = params[key]
			if (isNonEmptyString(inputValue)) value = inputValue
		}
		this.output(0).data = value
	}
}
