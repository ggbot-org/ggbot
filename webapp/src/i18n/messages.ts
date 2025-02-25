import { FormatjsIntlMessageId } from '../types/FormatjsIntlMessageIds'

export const i18nRichTextTags = ['b', 'em', 'i', 'strong'] as const
type I18nRichTextTag = (typeof i18nRichTextTags)[number]
type I18nMessageMarkupTag = I18nRichTextTag | 'a'

export type I18nMessageString = {
	type: 0
	value: string
}

export type I18nMessageParam = {
	type: 1
	/** Parameter name */
	value: string
}

type I18nMessagePluralValue = {
	type: 7
}

type I18nPluralOption = {
	value: Array<I18nMessagePluralValue | I18nMessageString>
}

type I18nMessagePlural = {
	offset: number
	options: Partial<{
		'=0': I18nPluralOption
		'=1': I18nPluralOption
		other: I18nPluralOption
	}>
	type: 6
	pluralType: 'cardinal'
	/** Parameter name */
	value: string
}

type I18nMessageMarkup = {
	children: Array<I18nMessageParam | I18nMessageString>
	type: 8
	value: I18nMessageMarkupTag
}

type I18nMessage =
	| I18nMessageMarkup
	| I18nMessageParam
	| I18nMessagePlural
	| I18nMessageString

export type I18nMessagesRecord = Record<FormatjsIntlMessageId, I18nMessage[]>

export type FormatMessageValues = Record<string, string | number>

export function formatMessage(
	message: I18nMessageParam | I18nMessageString | I18nMessagePluralValue,
	values?: FormatMessageValues,
	pluralValue?: number
) {
	if (message.type == 0) return message.value
	if (message.type == 1) {
		// Here `value` is a parameter name.
		const { value: paramName } = message
		if (paramName == 'appName') return PROJECT_SHORT_NAME
		if (values) return values[paramName] ?? ''
	}
	if (message.type == 7) return pluralValue
	return ''
}
