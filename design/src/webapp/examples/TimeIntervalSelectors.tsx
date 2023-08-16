import { DailyInterval } from "@ggbot2/design"
import { getDay, today } from "@ggbot2/time"
import { FC, useState } from "react"

export const TimeIntervalSelectors: FC = () => {
	const max = today()
	const [startDay, setStartDay] = useState(getDay(max).minus(45).days())
	const [endDay, setEndDay] = useState(max)

	return (
		<DailyInterval
			start={{
				label: "From",
				setDay: setStartDay,
				day: startDay
			}}
			end={{
				label: "From",
				setDay: setEndDay,
				day: endDay
			}}
			max={max}
		/>
	)
}
