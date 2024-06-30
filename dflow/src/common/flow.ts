import { StrategyFlow } from "@workspace/models"

import { DflowParameter, extractParameters } from "../parameters.js"
import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"

export const extractCommonParameters = (view: StrategyFlow["view"]) => {
	const parameters: DflowParameter[] = []
	const extractedParameters = extractParameters(view)
	for (const { kind, key, defaultValueNodeText } of extractedParameters) {
		try {
			const defaultValue: unknown = JSON.parse(defaultValueNodeText)
			if (
				(kind === BooleanParameter.kind &&
					typeof defaultValue === "boolean") ||
				(kind === NumberParameter.kind &&
					typeof defaultValue === "number") ||
				(kind === StringParameter.kind &&
					typeof defaultValue === "string")
			)
				parameters.push({
					kind,
					key,
					defaultValue
				})
		} catch (error) {
			if (error instanceof SyntaxError) continue
			throw error
		}
	}
	return parameters
}
