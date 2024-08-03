import { DayInterval } from "_/components/library"
import { getDay, today } from "minimal-time-helpers"
import { useState } from "react"

export function TimeIntervalSelectors() {
	const max = today()
	const [startDay, setStartDay] = useState(getDay(max).minus(45).days)
	const [endDay, setEndDay] = useState(max)

	return (
		<DayInterval
			start={{
				setDay: setStartDay,
				day: startDay
			}}
			end={{
				setDay: setEndDay,
				day: endDay
			}}
			max={max}
		/>
	)
}
