import { FlowViewSerializableGraph } from "flow-view"

import { DflowParameter, extractParameters } from "../parameters.js"
import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"

export const extractCommonParameters = (flow: FlowViewSerializableGraph) => {
	const parameters: DflowParameter[] = []
	const extractedParameters = extractParameters(flow)
	for (const { kind, key, defaultValueNodeText } of extractedParameters) {
		const defaultValue: unknown = JSON.parse(defaultValueNodeText)
		if (
			(kind === BooleanParameter.kind &&
				typeof defaultValue === "boolean") ||
			(kind === NumberParameter.kind &&
				typeof defaultValue === "number") ||
			(kind === StringParameter.kind && typeof defaultValue === "string")
		)
			parameters.push({
				kind,
				key,
				defaultValue
			})
	}
	return parameters
}
