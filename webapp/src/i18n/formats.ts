export type DayFormat = Required<
	Pick<Intl.DateTimeFormatOptions, "year" | "month" | "day">
>

export const dayFormat: DayFormat = {
	year: "numeric",
	month: "short",
	day: "2-digit"
}

export type TimeFormat = DayFormat &
	Required<Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "second">>

export const timeFormat: TimeFormat = {
	...dayFormat,
	minute: "2-digit",
	hour: "2-digit",
	second: "2-digit"
}
