import { I18nContext } from '_/contexts/I18n'
import { ReactNode, useContext, useMemo } from 'react'

import { FormatjsIntlMessageId } from '../types/FormatjsIntlMessageIds'

export function FormattedDate({ value }: {
	value: string
}) {
	return value
}

export function FormattedMessage({ id, values }: {
	id: FormatjsIntlMessageId
	values?: Record<string, unknown>
}) {
	const { messages } = useContext(I18nContext)

	return useMemo<ReactNode[] | null>(() => {
		if (!messages) return null
		const message = messages[id]

		// If no message is found, show nothing.
		// Notice that this cannot happen cause ids are typed.
		if (!message) return null

		// TODO write a test that checks messages integrity
		// for example type 8 can have children
		// markup tags must be b, em, strong, etc.
		return message.map(({ type, value }) => {
			if (type === 0) return value
			if (type === 1) {
				if (!values) return null
				// TODO
				// return values[value] ?? null
				return null
			}
			if (type === 8) {
				// TODO
				return null
			}
			return null
		})
	}, [messages, id, values])
}
