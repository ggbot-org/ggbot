import { FlowViewSerializableGraph } from "flow-view"

import { DflowParameter } from "../parameters.js"
import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"

type DflowCommonParameterKind = typeof BooleanParameter.kind

export type DflowCommonParameter = DflowParameter<DflowCommonParameterKind>

export const extractCommonParameters = (
	flow: FlowViewSerializableGraph
): DflowCommonParameter[] => {
	const parameters: DflowCommonParameter[] = []
	for (const node of flow.nodes) {
		const kind = node.text
		if (
			![
				BooleanParameter.kind,
				NumberParameter.kind,
				StringParameter.kind
			].includes(kind)
		)
			continue
		const firstInputId = node.ins?.[0].id
		const secondInputId = node.ins?.[1].id
		const firstParentNodeEdge = flow.edges.find(
			(edge) => edge.to[1] === firstInputId
		)
		const secondParentNodeEdge = flow.edges.find(
			(edge) => edge.to[1] === secondInputId
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
		const key: unknown = JSON.parse(maybeKey)
		const defaultValue: unknown = JSON.parse(maybeValue)

		if (typeof key !== "string") continue

		if (kind === BooleanParameter.kind && typeof defaultValue === "boolean")
			parameters.push({
				kind,
				key,
				defaultValue
			})

		if (kind === NumberParameter.kind && typeof defaultValue === "number")
			parameters.push({
				kind,
				key,
				defaultValue
			})

		if (kind === StringParameter.kind && typeof defaultValue === "string")
			parameters.push({
				kind,
				key,
				defaultValue
			})
	}
	return parameters
}
