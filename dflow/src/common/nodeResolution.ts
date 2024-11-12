import { isInfoNode, isJsonNode, isPercentageNode } from './nodeTextParser.js'
import { NodeViewType } from './nodeViewTypes.js'

/** Resolve node view type by its text. */
export function nodeTextToViewType(text: string): NodeViewType | undefined {
	if (isPercentageNode(text)) return 'perc'
	// Run `isJsonNode` before `isInfoNode` to avoid parse JSON twice.
	if (isJsonNode(text)) return 'json'
	if (isInfoNode(text)) return 'info'
}

/** Resolve common nodes kind. If no match is found, return the input text. */
export function nodeTextToDflowKind(text: string): string {
	const type = nodeTextToViewType(text)
	if (!type) return text
	if (type === 'json') return 'data'
	return type
}
