import { StrategyFlowGraph } from "@workspace/models"
import { coreNodesCatalog, DflowNodesCatalog } from "dflow"

import { ErrorUknownDflowNodes } from "../errors.js"
import { NodeTextToDflowKind, noOpNodeKinds } from "./nodeResolution.js"

/** Check if provided `graph` is well defined and compatible with `nodesCatalog`. */
export const dflowValidate = ({
	nodesCatalog,
	nodeTextToDflowKind,
	graph
}: DflowValidateArg): void => {
	const unknownNodes = extractUnknownNodes({
		nodesCatalog,
		nodeTextToDflowKind,
		graph
	})
	if (unknownNodes.length) throw new ErrorUknownDflowNodes(unknownNodes)
}

type DflowValidateArg = {
	nodesCatalog: DflowNodesCatalog
	graph: StrategyFlowGraph
	nodeTextToDflowKind: NodeTextToDflowKind
}

const extractUnknownNodes = ({
	nodesCatalog,
	graph,
	nodeTextToDflowKind
}: DflowValidateArg): Array<{ id: string; text: string }> => {
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
