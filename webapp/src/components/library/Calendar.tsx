import { classNames } from "_/classNames"
import { dateToDay, Day } from "minimal-time-helpers"
import {
	FC,
	memo,
	MouseEventHandler,
	useCallback,
	useMemo,
	useState
} from "react"
import { useIntl } from "react-intl"

import { Icon } from "./Icon"

const randomKey = () =>
	Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, "")
		.substring(0, 5)

const CalendarWeekDays = memo(() => {
	const { formatDate } = useIntl()

	const weekDayNames = [
		"1970-01-04",
		"1970-01-05",
		"1970-01-06",
		"1970-01-07",
		"1970-01-08",
		"1970-01-09",
		"1970-01-10"
	].map((day) => ({
		day,
		label: formatDate(day, { weekday: "short" })
	}))

	return (
		<>
			{weekDayNames.map(({ day, label }) => (
				<div key={day} className={classNames("Calendar__week-day")}>
					{label}
				</div>
			))}
		</>
	)
})

CalendarWeekDays.displayName = "CalendarWeekDays"

export type CalendarProps = {
	min?: Day
	max?: Day
	day: Day
	setDay: (arg: Day) => void
}

export const Calendar: FC<CalendarProps> = ({
	min,
	max,
	day: selectedDay,
	setDay: setSelectedDay
}) => {
	const { formatDate } = useIntl()

	const [monthOffset, setMonthOffset] = useState(0)

	const { firstDate, lastDate, dateCells, monthName, year } = useMemo(() => {
		const firstDate = new Date(selectedDay)
		firstDate.setDate(1)
		firstDate.setMonth(firstDate.getMonth() + monthOffset)

		const year = firstDate.getFullYear()
		const monthName = formatDate(firstDate, { month: "long" })

		const lastDate = new Date(firstDate)
		lastDate.setMonth(lastDate.getMonth() + monthOffset + 1)
		lastDate.setDate(lastDate.getDate() - 1)

		const datesBeforeFirstDate: Date[] = []
		const weekDay = firstDate.getDay()
		for (let i = weekDay; i > 0; i--) {
			const date = new Date(firstDate)
			date.setDate(date.getDate() - i)
			datesBeforeFirstDate.push(date)
		}

		const datesAfterLastDate: Date[] = []
		const weekDate = lastDate.getDay()
		for (let i = 1; i < 7 - weekDate; i++) {
			const date = new Date(lastDate)
			date.setDate(date.getDate() + i)
			datesAfterLastDate.push(date)
		}

		const datesOfMonth: Date[] = [firstDate]
		const n = lastDate.getDate()
		for (let i = 1; i < n; i++) {
			const date = new Date(firstDate)
			date.setDate(date.getDate() + i)
			datesOfMonth.push(date)
		}

		const dateCells = [
			...datesBeforeFirstDate.map((date) => ({
				date,
				isDateOfCurrentMonth: false
			})),
			...datesOfMonth.map((date) => ({
				date,
				isDateOfCurrentMonth: true
			})),
			...datesAfterLastDate.map((date) => ({
				date,
				isDateOfCurrentMonth: false
			}))
		]
			.map(({ date, ...rest }) => ({
				day: dateToDay(date),
				date,
				...rest
			}))
			.map(({ day, ...rest }) => ({
				selected: day === selectedDay,
				isSelectable:
					(min && day ? day >= min : true) &&
					(max && day ? day <= max : true),
				day,
				...rest
			}))
			.map(
				({
					date,
					day,
					isDateOfCurrentMonth,
					isSelectable,
					selected
				}) => {
					const onClick: MouseEventHandler<HTMLDivElement> = (
						event
					) => {
						event.stopPropagation()
						if (isSelectable) {
							setSelectedDay(day)
							setMonthOffset(0)
						}
					}
					return {
						day,
						isDateOfCurrentMonth,
						isSelectable,
						num: date.getDate(),
						onClick,
						selected,

						// Need a random key, using day is not enough, it can raise React warning:
						//
						//     Encountered two children with the same key.
						//
						key: randomKey()
					}
				}
			)

		return { firstDate, lastDate, dateCells, monthName, year }
	}, [
		formatDate,
		min,
		max,
		monthOffset,
		selectedDay,
		setSelectedDay,
		setMonthOffset
	])

	const isLastMonth = max && dateToDay(lastDate) >= max
	const isFirstMonth = min && dateToDay(firstDate) <= min

	const onClickPrevious = useCallback<MouseEventHandler<HTMLDivElement>>(
		(event) => {
			event.stopPropagation()
			if (isFirstMonth) return
			setMonthOffset((n) => n - 1)
		},
		[isFirstMonth, setMonthOffset]
	)

	const onClickNext = useCallback<MouseEventHandler<HTMLDivElement>>(
		(event) => {
			event.stopPropagation()
			if (isLastMonth) return
			setMonthOffset((n) => n + 1)
		},
		[isLastMonth, setMonthOffset]
	)

	return (
		<div className={classNames("Calendar")}>
			<div
				className={classNames("Calendar__head")}
				onClick={(event) => {
					event.stopPropagation()
				}}
			>
				<div
					className={classNames("Calendar__head-icon", {
						"has-text-grey-lighter": isFirstMonth
					})}
					onClick={onClickPrevious}
				>
					<Icon name="caret-left" />
				</div>

				<div className={classNames("Calendar__head-text")}>
					{monthName}
				</div>

				<div className={classNames("Calendar__head-text")}>{year}</div>

				<div
					className={classNames("Calendar__head-icon", {
						"has-text-grey-lighter": isLastMonth
					})}
					onClick={onClickNext}
				>
					<Icon name="caret-right" />
				</div>
			</div>

			<div className={classNames("Calendar__body")}>
				<CalendarWeekDays />

				{dateCells.map(
					({ isSelectable, key, num, onClick, selected }) => (
						<div
							key={key}
							className={classNames("Calendar__cell", {
								"Calendar__cell--selected": selected,
								"Calendar__cell--disabled": !isSelectable
							})}
							onClick={onClick}
						>
							{num}
						</div>
					)
				)}

				{
					/* Avoid layout shifting: in case there are 5 rows, fill with an empty row. */
					dateCells.length === 35
						? [0, 1, 2, 3, 4, 5, 6].map((i) => (
								<div key={i}>&nbsp;</div>
							))
						: null
				}
			</div>
		</div>
	)
}
