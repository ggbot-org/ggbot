import { DayFormat, dayFormat, TimeFormat, timeFormat } from "_/i18n/formats.js"
import { Day, Timestamp } from "minimal-time-helpers"
import { FC, TimeHTMLAttributes, useMemo } from "react"
import { FormattedDate } from "react-intl"

const dateTimeFormats = ["day", "time"] as const
export type DateTimeFormat = (typeof dateTimeFormats)[number]

export type DateTimeProps = {
	format: DateTimeFormat
} & Omit<TimeHTMLAttributes<HTMLTimeElement>, "dateTime"> &
	Partial<{
		/**
		 * The `value` prop is passed to `dateTime` attribute of `<time>` tag,
		 *
		 * @privateRemarks
		 * The `dateTime` attribute is typed as `string | undefined`. The
		 * `value`prop is a `Day | Timestamp` which is compatible `dateTime`
		 * attribute type and its valid values.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#valid_datetime_values}
		 */
		value: Day | Timestamp
	}>

export const DateTime: FC<DateTimeProps> = ({ format, value }) => {
	const formatOptions = useMemo<DayFormat | TimeFormat>(() => {
		if (format === "day") return dayFormat
		if (format === "time") return timeFormat
		return dayFormat // fallback
	}, [format])

	if (!value) return null

	return (
		<time dateTime={value}>
			<FormattedDate value={value} {...formatOptions} />
		</time>
	)
}
