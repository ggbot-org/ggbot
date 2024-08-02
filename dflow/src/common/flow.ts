import {
	isFiniteNumber,
	isIdentifierString,
	isNonEmptyString,
	StrategyFlowGraph
} from "@workspace/models"
import { DflowNode } from "dflow"
import { now } from "minimal-time-helpers"

import { DflowCommonContext as Context } from "./context.js"
import { DflowCommonHost } from "./host.js"
import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"
import { nodesCatalog } from "./nodesCatalog.js"
import { DflowParameter } from "./parameters.js"

export const extractCommonParametersFromFlow = async (
	graph: StrategyFlowGraph
): Promise<DflowParameter[]> => {
	const parameters: DflowParameter[] = []
	const context: Context = {
		params: {},
		memory: {},
		time: now()
	}

	const dflow = new DflowCommonHost(
		{
			nodesCatalog: {
				...nodesCatalog,
				[BooleanParameter.kind]: class MockedBooleanParameter extends DflowNode {
					static kind = BooleanParameter.kind
					static inputs = BooleanParameter.inputs
					static outputs = BooleanParameter.outputs
					run() {
						// 👇 Sync with BooleanParameter run()
						const { params } = this.host.context as Context
						const key = this.input(0).data
						const defaultValue = this.input(1).data
						if (
							!isIdentifierString(key) ||
							typeof defaultValue !== "boolean"
						) return this.clearOutputs()
						let value = defaultValue
						if (key in params) {
							const inputValue = params[key]
							if (typeof inputValue === "boolean") value = inputValue
						}
						this.output(0).data = value
						// Set parameter
						parameters.push({
							kind: BooleanParameter.kind,
							key,
							defaultValue
						})
					}
				},
				[NumberParameter.kind]: class MockedNumberParameter extends DflowNode {
					static kind = NumberParameter.kind
					static inputs = NumberParameter.inputs
					static outputs = NumberParameter.outputs
					run() {
						// 👇 Sync with NumberParameter run()
						const { params } = this.host.context as Context
						const key = this.input(0).data
						const defaultValue = this.input(1).data
						if (
							!isIdentifierString(key) ||
							!isFiniteNumber(defaultValue)
						) return this.clearOutputs()
						let value = defaultValue
						if (key in params) {
							const inputValue = params[key]
							if (isFiniteNumber(inputValue)) value = inputValue
						}
						this.output(0).data = value
						// Set parameter
						parameters.push({
							kind: NumberParameter.kind,
							key,
							defaultValue
						})
					}
				},
				[StringParameter.kind]: class MockedStringParameter extends DflowNode {
					static kind = StringParameter.kind
					static inputs = StringParameter.inputs
					static outputs = StringParameter.outputs
					run() {
						// 👇 Sync with StringParameter run()
						const { params } = this.host.context as Context
						const key = this.input(0).data
						const defaultValue = this.input(1).data
						if (
							!isIdentifierString(key) ||
							!isNonEmptyString(defaultValue)
						) return this.clearOutputs()
						let value = defaultValue
						if (key in params) {
							const inputValue = params[key]
							if (isNonEmptyString(inputValue)) value = inputValue
						}
						this.output(0).data = value
						// Set parameter
						parameters.push({
							kind: StringParameter.kind,
							key,
							defaultValue
						})
					}
				}
			}
		},
		context
	)

	dflow.load(graph)
	await dflow.run()
	return parameters
}
