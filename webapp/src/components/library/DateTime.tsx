import { DayFormat, dayFormat, TimeFormat, timeFormat } from "_/i18n/formats"
import { Day } from "minimal-time-helpers"
import { TimeHTMLAttributes } from "react"
import { FormattedDate } from "react-intl"

const dateTimeFormats = ["day", "time"] as const
type DateTimeFormat = (typeof dateTimeFormats)[number]

type Props = {
	format: DateTimeFormat
} & Omit<TimeHTMLAttributes<HTMLTimeElement>, "dateTime"> &
	Partial<{ value: Day }>

export function DateTime({ format, value }: Props) {
	if (!value) return null

	let formatOptions: DayFormat | TimeFormat | undefined
	if (format === "day") formatOptions = dayFormat
	if (format === "time") formatOptions = timeFormat

	return (
		<time dateTime={value}>
			<FormattedDate value={value} {...formatOptions} />
		</time>
	)
}
