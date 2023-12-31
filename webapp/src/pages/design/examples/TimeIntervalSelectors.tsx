import { DailyInterval } from "_/components/library"
import { getDay, today } from "minimal-time-helpers"
import { FC, useState } from "react"

export const TimeIntervalSelectors: FC = () => {
	const max = today()
	const [startDay, setStartDay] = useState(getDay(max).minus(45).days)
	const [endDay, setEndDay] = useState(max)

	return (
		<DailyInterval
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
