import { StrategyFlowGraph } from "@workspace/models"

import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"
import { DflowParameter } from "./parameters.js"

export const extractCommonParameters = (flow: StrategyFlowGraph) => {
	const parameters: DflowParameter[] = []

	for (const node of flow.nodes) {
		const { text: kind, id: nodeId } = node

		const firstInputId = node.ins?.[0]?.id
		const secondInputId = node.ins?.[1]?.id
		if (!firstInputId || !secondInputId) continue

		const firstParentNodeEdge = flow.edges.find(
			(edge) => edge.to[0] === nodeId && edge.to[1] === firstInputId
		)
		const secondParentNodeEdge = flow.edges.find(
			(edge) => edge.to[0] === nodeId && edge.to[1] === secondInputId
		)
		const firstParentNode = flow.nodes.find(
			({ id }) => id === firstParentNodeEdge?.from[0]
		)
		const secondParentNode = flow.nodes.find(
			({ id }) => id === secondParentNodeEdge?.from[0]
		)

		const maybeKey = firstParentNode?.text
		const maybeValue = secondParentNode?.text
		if (!maybeKey || !maybeValue) continue

		try {
			const key: unknown = JSON.parse(maybeKey)
			if (typeof key !== "string") continue

			const defaultValue: unknown = JSON.parse(maybeValue)

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
