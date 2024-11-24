export type I18nMessageMarkupTag = 'a' | 'b' | 'em' | 'strong'

type I18nMessageString = {
	type: 0
	value: string
}

type I18nMessageParam = {
	type: 1
	/** Parameter name */
	value: string
}

type I18nMessageMarkup = {
	children: Array<I18nMessageParam | I18nMessageString>
	type: 8
	value: I18nMessageMarkupTag
}

export type I18nMessage = I18nMessageMarkup | I18nMessageParam | I18nMessageString
