import { randomKey } from '_/components/library/randomKey'
import { I18nContext } from '_/contexts/I18n'
import { formatMessage, FormatMessageValues, i18nRichTextTags } from '_/i18n/messages'
import { ReactNode, useContext, useMemo } from 'react'

import { FormatjsIntlMessageId } from '../types/FormatjsIntlMessageIds'

export function FormattedDate({ value, ...format }: {
	value: string
} & Intl.DateTimeFormatOptions) {
	const { language } = useContext(I18nContext)
	return new Intl.DateTimeFormat(language,	format).format(new Date(value))
}

export function FormattedMessage({ id, values }: {
	id: FormatjsIntlMessageId
	values?: FormatMessageValues
}) {
	const { messages } = useContext(I18nContext)

	return useMemo<ReactNode[] | null>(() => {
		if (!messages) return null
		const messageList = messages[id]

		function formatter(message: Parameters<typeof formatMessage>[0]) {
			return formatMessage(message, values)
		}

		function pluralFormatter(pluralValue: number) {
			return function (message: Parameters<typeof formatMessage>[0]) {
				return formatMessage(message, values, pluralValue)
			}
		}

		// If no message list is found, show nothing.
		if (!messageList) return null

		return messageList.map((message) => {
			const { type, value } = message
			if (type == 0) return value
			if (type == 1) {
				// Here `value` is a parameter name.
				if (value == 'appName') return PROJECT_SHORT_NAME
				if (values) return (values as FormatMessageValues)[value] ?? null
			}
			if (type == 6) {
				const { offset, options, pluralType } = message
				let num = (values as FormatMessageValues)[value]
				if (typeof num != 'number') return null
				num += offset
				if (pluralType == 'cardinal') {
					if (options['=0'] && num == 0) return options['=0'].value.map(pluralFormatter(num))
					if (options['=1'] && num == 1) return options['=1'].value.map(pluralFormatter(num))
					if (options.other) return options.other.value.map(pluralFormatter(num))
				}
			}
			if (type == 8) {
				const { children, value: Tag } = message
				// Handle rich text.
				if ((i18nRichTextTags as readonly string[]).includes(value)) {
					return (
						<Tag key={randomKey()}>
							{children.map((child) => formatMessage(child, values))}
						</Tag>
					)
				}
				// Handle links.
				if (value == 'a' && values && 'href' in values) {
					return (
						<a key={randomKey()} href={values.href as string}>
							{children.map(formatter)}
						</a>
					)
				}
			}
			return null
		})
	}, [messages, id, values])
}
