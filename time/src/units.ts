import { isLiteralType } from "@ggbot2/type-utils"

import { Time } from "./time.js"

export const timeUnits = [
	"second",
	"minute",
	"hour",
	"day",
	"month",
	"year"
] as const
export type TimeUnit = (typeof timeUnits)[number]
export const isTimeUnit = isLiteralType<TimeUnit>(timeUnits)

export const timeUnitPlurals = timeUnits.map((timeUnit) => `${timeUnit}s`)
export type TimeUnitPlural = (typeof timeUnitPlurals)[number]
export const isTimeUnitPlural = isLiteralType<TimeUnitPlural>(timeUnitPlurals)

export const timeUnitDuration: Record<
	Extract<TimeUnit, "second" | "minute" | "hour" | "day">,
	Time
> = {
	second: 1000,
	minute: 60_000,
	hour: 3_600_000,
	day: 86_400_000
}
