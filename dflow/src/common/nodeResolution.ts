import { isInfoNode, isJsonNode, isPercentageNode } from "./nodeTextParser.js"
import { NodeViewType } from "./nodeViewTypes.js"

type NodeTextToViewType = (text: string) => string | undefined

/** Node kinds to be ignored during execution. */
export const noOpNodeKinds = ["info"]

/** Resolve node view type by its text. */
export const nodeTextToViewType: NodeTextToViewType = (
	text
): NodeViewType | undefined => {
	if (isPercentageNode(text)) return "perc"
	// Run `isJsonNode` before `isInfoNode` to avoid parse JSON twice.
	if (isJsonNode(text)) return "json"
	if (isInfoNode(text)) return "info"
	return undefined
}

/** Resolve node kind by its text. */
export type NodeTextToDflowKind = (text: string) => string

/** Resolve common nodes kind. If no match is found, return the input text. */
export const commonNodeTextToDflowKind: NodeTextToDflowKind = (text) => {
	const type = nodeTextToViewType(text)
	if (!type) return text
	if (type === "json") return "data"
	return type
}
