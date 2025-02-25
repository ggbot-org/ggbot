import { I18nContext } from '_/contexts/I18n'
import {
	formatMessage,
	FormatMessageValues,
	I18nMessageParam,
	I18nMessageString,
} from '_/i18n/messages'
import { useContext } from 'react'

import { FormatjsIntlMessageId } from '../types/FormatjsIntlMessageIds'

export function useIntl() {
	const { language, messages } = useContext(I18nContext)
	return {
		formatDate(
			date: Date | number | string,
			format: Intl.DateTimeFormatOptions
		) {
			return new Intl.DateTimeFormat(language, format).format(new Date(date))
		},
		formatMessage({
			id,
			values,
		}: {
			id: FormatjsIntlMessageId
			values?: FormatMessageValues
		}): string {
			if (!messages) return ''
			const messageList = messages[id]
			return messageList
				.map((message) =>
					formatMessage(
						// Notice that only messages with type 0 and type 1 are handled.
						// It is worth to use a cast rather than a narrowing.
						message as I18nMessageParam | I18nMessageString,
						values
					)
				)
				.join('')
		},
		formatNumber(value: number, format: Intl.NumberFormatOptions) {
			return new Intl.NumberFormat(language, format).format(value)
		},
	}
}
