import { randomKey } from '_/components/library/randomKey'
import { I18nContext } from '_/contexts/I18n'
import { formatMessage, FormatMessageValues, i18nRichTextTags } from '_/i18n/messages'
import { ReactNode, useContext, useMemo } from 'react'

import { FormatjsIntlMessageId } from '../types/FormatjsIntlMessageIds'

export function FormattedDate({ value }: {
	value: string
}) {
	// TODO
	return value
}

export function FormattedMessage({ id, values }: {
	id: FormatjsIntlMessageId
	values?: FormatMessageValues
}) {
	const { messages } = useContext(I18nContext)

	return useMemo<ReactNode[] | null>(() => {
		if (!messages) return null
		const messageList = messages[id]

		// If no message list is found, show nothing.
		if (!messageList) return null

		// TODO write a test that checks messages integrity
		// for example type 8 can have children
		// markup tags must be b, em, strong, etc.
		// but children of b cannot contain markup tags, it does not make sense.
		// Same for other markup tags.
		// there are some special values like appName.
		return messageList.map((message) => {
			const { type, value } = message
			if (type == 0) return value
			if (type == 1) {
				// Here `value` is a parameter name.
				if (value == 'appName') return PROJECT_SHORT_NAME
				if (values) return (values as FormatMessageValues)[value] ?? null
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
							{children.map((child) => formatMessage(child, values))}
						</a>
					)
				}
			}
			return null
		})
	}, [messages, id, values])
}
