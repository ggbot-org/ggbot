import { SerializablePrimitive } from "@workspace/models"
import { FlowViewSerializableGraph } from "flow-view"

export type DflowParameter = {
	kind: string
	key: string
	defaultValue: SerializablePrimitive
}

export const extractParameters = (flow: FlowViewSerializableGraph) => {
	const parameters: Array<{
		kind: string
		key: string
		defaultValueNodeText: string
	}> = []

	for (const node of flow.nodes) {
		const { text: kind, id: nodeId } = node

		const firstInputId = node.ins?.[0].id
		const secondInputId = node.ins?.[1].id

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

			parameters.push({
				kind,
				key,
				defaultValueNodeText: maybeValue
			})
		} catch (error) {
			if (error instanceof SyntaxError) continue
			throw error
		}
	}

	return parameters
}
