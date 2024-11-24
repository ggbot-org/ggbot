import { FormatjsIntlMessageId } from '../types/FormatjsIntlMessageIds'

export function useIntl() {
	// TODO get language from i18n context
	return {
		formatDate(date: Date | number | string, _format: Intl.DateTimeFormatOptions) {
			// TODO
			return String(date)
		},
		formatMessage({ id }: { id: FormatjsIntlMessageId }) {
			// TODO
			return id
		},
		formatNumber(value: number, _format: Intl.NumberFormatOptions) {
			// TODO
			return value
		}
	}
}
