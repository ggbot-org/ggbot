import { StrategyFlowGraph } from "@workspace/models"
import { coreNodesCatalog, DflowNodesCatalog } from "dflow"

import { ErrorUknownDflowNodes } from "../errors.js"
import { nodeTextToDflowKind, noOpNodeKinds } from "./nodeResolution.js"

type DflowValidateArg = {
	nodesCatalog: DflowNodesCatalog
	graph: StrategyFlowGraph
}

/** Check if provided `graph` is well defined and compatible with `nodesCatalog`. */
export function dflowValidate (arg: DflowValidateArg) {
	const unknownNodes = extractUnknownNodes(arg)
	if (unknownNodes.length) throw new ErrorUknownDflowNodes(unknownNodes)
}

function extractUnknownNodes ({ nodesCatalog, graph }: DflowValidateArg): Array<{ id: string; text: string }> {
	const nodeKinds = Object.keys({ ...nodesCatalog, ...coreNodesCatalog })
	const viewNodeKinds = graph.nodes.map(({ id, text }) => ({
		id,
		text,
		kind: nodeTextToDflowKind(text)
	}))
	const unknownNodes = viewNodeKinds.filter(
		({ kind }) => ![...nodeKinds, ...noOpNodeKinds].includes(kind)
	)
	return unknownNodes.map(({ id, text }) => ({
		id,
		text
	}))
}
