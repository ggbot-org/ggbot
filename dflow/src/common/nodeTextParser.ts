import { Dflow } from "dflow"

/** A node is a comment if its text contains spaces, newlines. */
export const isInfoNode = (text: string) =>
	(text.indexOf(" ") > -1 || text.indexOf("\n") > -1) &&
	// A JSON could contain spaces, e.g. '{"message":"hello world"}'
	!isJsonNode(text)

/** A node which text is valid JSON is used to store data. */
export const isJsonNode = (text: string) => {
	try {
		JSON.parse(text)
		return true
	} catch (error) {
		if (error instanceof SyntaxError) return false
		throw error
	}
}

export const isPercentageNode = (text: string) => {
	if (!text.includes("%")) return false
	return typeof parsePercentage(text) === "number"
}

export const parsePercentage = (text: string): number | undefined => {
	const maybeNum = Number(text.replace("%", "").replace(/\s/g, ""))
	return Dflow.isNumber(maybeNum) ? maybeNum : undefined
}
