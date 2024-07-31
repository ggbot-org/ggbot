import { AuthenticationContext } from "_/contexts/Authentication"
import { quota } from "@workspace/models"
import { getDay, today } from "minimal-time-helpers"
import { useContext, useState } from "react"

export function useDailyInterval() {
	const { subscription } = useContext(AuthenticationContext)
	const max = today()
	const min = getDay(max).minus(
		quota.MAX_OPERATIONS_HISTORY_DAYS(subscription?.plan)
	).days
	const numDays = 30
	const [start, setStart] = useState(getDay(today()).minus(numDays).days)
	const [end, setEnd] = useState(max)
	return { min, max, start, setStart, end, setEnd }
}
