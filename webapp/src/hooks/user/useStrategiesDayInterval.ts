import { AuthenticationContext } from "_/contexts/Authentication"
import { sessionWebStorage } from "_/storages/session"
import { quota } from "@workspace/models"
import { Day, DayInterval, getDay, today } from "minimal-time-helpers"
import { useCallback, useContext, useState } from "react"

export function useStrategiesDayInterval() {
	const { subscription } = useContext(AuthenticationContext)
	const max = today()
	const min = getDay(max).minus(
		quota.MAX_OPERATIONS_HISTORY_DAYS(subscription?.plan)
	).days
	const storedDayIntervalStart = sessionWebStorage.strategiesDayIntervalStart.get()
	const storedDayIntervalEnd = sessionWebStorage.strategiesDayIntervalEnd.get()
	const numDays = 30
	const defaultDayInterval: DayInterval = {
		start: getDay(max).minus(numDays).days,
		end: max
	}
	const [start, setStart] = useState(storedDayIntervalStart??defaultDayInterval.start)
	const [end, setEnd] = useState(storedDayIntervalEnd??defaultDayInterval.end)
	const setStartDay = useCallback((day: Day) => {
		sessionWebStorage.strategiesDayIntervalStart.set(day)
		setStart(day)
	}, [])
	const setEndDay = useCallback((day: Day) => {
		sessionWebStorage.strategiesDayIntervalEnd.set(day)
		setEnd(day)
	}, [])
	return {
		min, max, start, end,
		setStart: setStartDay,
		setEnd: setEndDay
	}
}
