import {DflowErrorItemNotFound} from 'dflow'

import {nodeTextToDflowKind} from './nodeResolution.js'
import {parsePercentage} from './nodeTextParser.js'

// This custom error should not happen if graph is validated.
class NodeHasNoOutputError extends Error {
	/** @param {string} id */
	constructor(id) {
		super(`Node has no output nodeId=${id}`)
	}
}

/** @type {import('./loader').load} */
export function load({dflow, graph}) {
	const nodeKinds = Object.keys(dflow.nodesCatalog)

	// Create nodes.
	for (const {id, ins, outs, text} of graph.nodes) {
		const type = nodeTextToDflowKind(text)
		if (type === 'info') continue
		if (type === 'data') {
			// If node has type "data", parse text as JSON and create a DflowNode with kind "data".
			const out = outs?.[0]
			if (!out) throw new NodeHasNoOutputError(id)
			try {
				const data = JSON.parse(text)
				dflow.newNode({id, kind: type, outputs: [{id: out.id, data}]})
			} catch (error) {
				if (error instanceof SyntaxError) continue
				throw error
			}
		}
		if (type === 'perc') {
			// If node has type "perc", parse text as percentage and create a DflowNode with kind "data".
			const out = outs?.[0]
			if (!out) throw new NodeHasNoOutputError(id)
			const data = parsePercentage(text)
			dflow.newNode({id, kind: 'data', outputs: [{id: out.id, data}]})
		}
		if (nodeKinds.includes(text)) {
			// By default create a Dflow node with `kind` given by `text`.
			const NodeClass = dflow.nodesCatalog[text]
			// Start from inputs and outputs definitions and add them correponding `id` found in graph.
			// Notice that input or output `id` could be missing,
			// for example if a new input or output was added to
			// the node and the graph was created before the node
			// got that input or output.
			const inputs = NodeClass.inputs?.map((_, index) => ({id: ins?.[index]?.id}))
			const outputs = NodeClass.outputs?.map((_, index) => ({id: outs?.[index]?.id}))
			dflow.newNode({id, kind: text, inputs, outputs})
		}
	}

	// Connect nodes with edges.
	for (const {id, from: source, to: target} of graph.edges) {
		try {
			dflow.newEdge({id, source, target})
		} catch (error) {
			// Ignore broken connections, there could be unknown nodes.
			if (error instanceof DflowErrorItemNotFound) continue
			throw error
		}
	}
}