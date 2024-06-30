import { StrategyFlowGraph } from "@workspace/models"
import { Dflow, DflowData, DflowErrorItemNotFound } from "dflow"

import { NodeTextToDflowKind } from "./nodeResolution.js"
import { isInfoNode } from "./nodeTextParser.js"

/**
 * A Dflow instance that can load a StrategyFlowGraph.
 *
 * @example
 *
 * ```ts
 * import { StrategyFlowGraph } from "@workspace/models"
 * import { DflowLoader, load } from "../path/to/loader.js"
 *
 * class MyDflowHost extends Dflow implements DflowLoader {
 * 	load(graph: StrategyFlowGraph): void {
 * 		load({
 * 			dflow: this,
 * 			nodeTextToDflowKind,
 * 			graph
 * 		})
 * 	}
 * }
 * ```
 */
export interface DflowLoader extends Dflow {
	load(graph: StrategyFlowGraph): void
}

/**
 * Parse and load a Dflow graph.
 *
 * @remarks
 * Unknown nodes and broken connections are ignored.
 */
export const load = ({
	dflow,
	nodeTextToDflowKind,
	graph
}: {
	dflow: DflowLoader
	nodeTextToDflowKind: NodeTextToDflowKind
	graph: StrategyFlowGraph
}) => {
	const nodeKinds = Object.keys(dflow.nodesCatalog)

	// Create nodes.
	for (const { id, ins, outs, text } of graph.nodes) {
		if (isInfoNode(text)) continue

		const type = nodeTextToDflowKind(text)
		if (type === "data") {
			// If node has type "data", parse text as JSON and create a DflowNode with kind "data".
			const out = outs?.[0]
			if (!out) {
				// Throw with a custom error; it should not happen if graph is validated.
				throw new Error(`Data node has no out nodeId=${id}`)
			}
			try {
				const data = JSON.parse(text) as DflowData
				dflow.newNode({
					id,
					kind: type,
					outputs: [{ id: out.id, data }]
				})
			} catch (error) {
				if (error instanceof SyntaxError) continue
				throw error
			}
		} else if (nodeKinds.includes(text)) {
			// By default create a Dflow node with `kind` given by `text`.
			const NodeClass = dflow.nodesCatalog[text]
			// Start from inputs and outputs definitions and add them correponding `id` found in graph.
			// Notice that input or output `id` could be missing,
			// for example if a new input or output was added to
			// the node and the graph was created before the node
			// got that input or output.
			const inputs = NodeClass.inputs?.map((_, index) => ({
				id: ins?.[index]?.id
			}))
			const outputs = NodeClass.outputs?.map((_, index) => ({
				id: outs?.[index]?.id
			}))
			dflow.newNode({
				id,
				kind: text,
				inputs,
				outputs
			})
		}
	}

	// Connect nodes with edges.
	for (const { id, from: source, to: target } of graph.edges) {
		try {
			dflow.newEdge({ id, source, target })
		} catch (error) {
			// Ignore broken connections, there could be unknown nodes.
			if (error instanceof DflowErrorItemNotFound) continue

			throw error
		}
	}
}
