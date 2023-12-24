import { Time, TimeUnit, timeUnitDuration } from "minimal-time-helpers"
import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { isNaturalNumber, NaturalNumber } from "./numbers.js"

const frequencyIntervals = ["1h", "1m"] as const
export type FrequencyInterval = (typeof frequencyIntervals)[number]
export const isFrequencyInterval =
	isLiteralType<FrequencyInterval>(frequencyIntervals)

export type Frequency = {
	every: NaturalNumber
	interval: FrequencyInterval
}

type FrequencyTimeUnit = Extract<TimeUnit, "minute" | "hour">

const frequencyIntervalTimeUnit: Record<FrequencyInterval, FrequencyTimeUnit> =
	{
		"1m": "minute",
		"1h": "hour"
	}

export const frequencyIntervalDuration = ({
	every,
	interval
}: Frequency): Time => {
	const timeUnit = frequencyIntervalTimeUnit[interval]
	return timeUnitDuration[timeUnit] * every
}

export const isFrequency = objectTypeGuard<Frequency>(
	({ every, interval }) =>
		isNaturalNumber(every) && isFrequencyInterval(interval)
)

export const everyOneHour = (): Frequency => ({ every: 1, interval: "1h" })
