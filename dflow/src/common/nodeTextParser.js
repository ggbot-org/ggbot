import {Dflow} from 'dflow'

import {div} from './nodes/arithmetic.js'

/** @type {import('./nodeTextParser').isInfoNode} */
export function isInfoNode(text) {
	return (text.indexOf(' ') > -1 || text.indexOf('\n') > -1) &&
		// A JSON could contain spaces, e.g. '{"message":"hello world"}'
		!isJsonNode(text)
}

/** @type {import('./nodeTextParser').isJsonNode} */
export function isJsonNode(text) {
	try {
		JSON.parse(text)
		return true
	} catch {
		return false
	}
}

/** @type {import('./nodeTextParser').isPercentageNode} */
export function isPercentageNode(text) {
	if (!text.includes('%')) return false
	return typeof parsePercentage(text) === 'number'
}

/** @type {import('./nodeTextParser').parsePercentage} */
export function parsePercentage(text) {
	const maybeNum = Number(text.replace('%', '').replace(/\s/g, ''))
	return Dflow.isNumber(maybeNum) ? div(maybeNum, 100) : undefined
}
