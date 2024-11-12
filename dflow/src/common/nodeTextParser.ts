import { Dflow } from 'dflow'

import { div } from './nodes/arithmetic.js'

/** A node is a comment if its text contains spaces, newlines. */
export function isInfoNode (text: string) {
	return (text.indexOf(' ') > -1 || text.indexOf('\n') > -1) &&
	// A JSON could contain spaces, e.g. '{"message":"hello world"}'
	!isJsonNode(text)
}

/** A node which text is valid JSON is used to store data. */
export function isJsonNode (text: string) {
	try {
		JSON.parse(text)
		return true
	} catch (error) {
		if (error instanceof SyntaxError) return false
		throw error
	}
}

export function isPercentageNode (text: string) {
	if (!text.includes('%')) return false
	return typeof parsePercentage(text) === 'number'
}

export function parsePercentage (text: string): number | undefined {
	const maybeNum = Number(text.replace('%', '').replace(/\s/g, ''))
	return Dflow.isNumber(maybeNum) ? div(maybeNum, 100) : undefined
}
