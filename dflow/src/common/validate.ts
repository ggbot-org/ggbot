import { StrategyFlowGraph } from "@workspace/models"
import { coreNodesCatalog, DflowNodesCatalog } from "dflow"

import { ErrorUknownDflowNodes } from "../errors.js"
import { NodeTextToDflowKind, noOpNodeKinds } from "./nodeResolution.js"

type DflowValidateArg = {
	nodesCatalog: DflowNodesCatalog
	graph: StrategyFlowGraph
	nodeTextToDflowKind: NodeTextToDflowKind
}

/** Check if provided `graph` is well defined and compatible with `nodesCatalog`. */
export const dflowValidate = (arg: DflowValidateArg): void => {
	const unknownNodes = extractUnknownNodes(arg)
	if (unknownNodes.length) throw new ErrorUknownDflowNodes(unknownNodes)
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
