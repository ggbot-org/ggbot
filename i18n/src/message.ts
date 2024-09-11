/* MessageFormat uses patterns of the following form:

    message = messageText (argument messageText)*
    argument = noneArg | simpleArg | complexArg
    complexArg = choiceArg | pluralArg | selectArg | selectordinalArg

    noneArg = '{' argNameOrNumber '}'
    simpleArg = '{' argNameOrNumber ',' argType [',' argStyle] '}'
    choiceArg = '{' argNameOrNumber ',' "choice" ',' choiceStyle '}'
    pluralArg = '{' argNameOrNumber ',' "plural" ',' pluralStyle '}'
    selectArg = '{' argNameOrNumber ',' "select" ',' selectStyle '}'
    selectordinalArg = '{' argNameOrNumber ',' "selectordinal" ',' pluralStyle '}'

    choiceStyle: see ChoiceFormat
    pluralStyle: see PluralFormat
    selectStyle: see SelectFormat

    argNameOrNumber = argName | argNumber
    argName = [^[[:Pattern_Syntax:][:Pattern_White_Space:]]]+
    argNumber = '0' | ('1'..'9' ('0'..'9')*)

    argType = "number" | "date" | "time" | "spellout" | "ordinal" | "duration"
    argStyle = "short" | "medium" | "long" | "full" | "integer" | "currency" | "percent" | argStyleText | "::" argSkeletonText

See https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/text/MessageFormat.html */

type Token = {
	kind: "messageText"
	value: string
} | {
	kind: "noneArg"
	value: string
}

export function parseMessage(message: string): Token[] {
	if (!message) return [{ kind: "messageText", value: "" }]
	const tokens: Token[] = []
	const matches = message.matchAll(RegExp(
		"(?<textBefore>[^{]*)" +
			"(:?" +
				"\\{(?<messageArgument>\\w+)\\}" +
				"(?<textAfter>[^{]*)" +
			"){0,1}",
		"g"))
	for (const match of matches) {
		if (!match.groups) continue
		const { textBefore, messageArgument, textAfter } = match.groups
		if (textBefore) {
			tokens.push({ kind: "messageText", value: textBefore })
		}
		if (messageArgument) {
			tokens.push({ kind: "noneArg", value: messageArgument })
		}
		if (textAfter) {
			tokens.push({ kind: "messageText", value: textAfter })
		}
	}
	return tokens
}

type Messages = { [key in string]: string }

type TranslateMessageArg = {
	id: string
	values?: { [key in string]: string }
}

export function translateMessage(messages: Messages, { id, values }: TranslateMessageArg) {
	if (!(id in messages)) return ""
	return parseMessage(messages[id]).reduce((translation, token) => {
		if (token.kind === "messageText") {
			return translation.concat(token.value)
		}
		if (token.kind === "noneArg") {
			const key = token.value
			const value = values?.[key]
			return translation.concat(typeof value === "string" ? value : "")
		}
		console.error("Cannot parse token", token)
		return translation
	}, "")
}
