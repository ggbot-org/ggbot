import { DayFormat, dayFormat, TimeFormat, timeFormat } from '_/i18n/formats'
import { Day } from 'minimal-time-helpers'
import { TimeHTMLAttributes } from 'react'
import { FormattedDate } from 'react-intl'

type DateTimeFormat = 'day' | 'time'

export function DateTime({
	format, value
}: Omit<
	TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'
> & Partial<{ value: Day }> & {
	format: DateTimeFormat
}) {
	if (!value) return null

	let formatOptions: DayFormat | TimeFormat | undefined
	if (format === 'day') formatOptions = dayFormat
	if (format === 'time') formatOptions = timeFormat

	return (
		<time dateTime={value}>
			<FormattedDate value={value} {...formatOptions} />
		</time>
	)
}
