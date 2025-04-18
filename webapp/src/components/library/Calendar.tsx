import { Classname, classnames } from '_/classnames'
import { useIntl } from '_/i18n/hooks'
import { dateToDay, Day } from 'minimal-time-helpers'
import { Dispatch, MouseEvent, SetStateAction, useMemo, useState } from 'react'

import { Icon, IconProps } from './Icon'
import { randomKey } from './randomKey'

function CalendarWeekDays() {
	const { formatDate } = useIntl()

	// The day 1970-01-04 was a Sunday.
	const weekDayNames = ['04', '05', '06', '07', '08', '09', '10']
		.map((dd) => `1970-01-${dd}`)
		.map((day) => ({ day, label: formatDate(day, { weekday: 'short' }) }))

	return (
		<div
			className={'calendar__grid' satisfies Classname}
			onClick={(event) => event.stopPropagation()}
		>
			{weekDayNames.map(({ day, label }) => (
				<div key={day} className={'calendar__week-day' satisfies Classname}>
					{label}
				</div>
			))}
		</div>
	)
}

function CalendarHead({
	caretSize = '1.2em',
	isFirstMonth,
	isLastMonth,
	monthName,
	setMonthOffset,
	year,
}: {
	caretSize?: IconProps['size']
	isFirstMonth: boolean
	isLastMonth: boolean
	monthName: string
	setMonthOffset: Dispatch<SetStateAction<number>>
	year: number
}) {
	return (
		<div
			className={'calendar__head' satisfies Classname}
			onClick={(event) => event.stopPropagation()}
		>
			<div
				className={classnames('calendar__head-icon', {
					'has-text-grey-lighter': isFirstMonth,
				})}
				onClick={(event) => {
					event.stopPropagation()
					if (isFirstMonth) return
					setMonthOffset((n) => n - 1)
				}}
			>
				<Icon name="caret-left" size={caretSize} />
			</div>
			<div className={'calendar__head-text' satisfies Classname}>
				{monthName}
			</div>
			<div className={'calendar__head-text' satisfies Classname}>{year}</div>
			<div
				className={classnames('calendar__head-icon', {
					'has-text-grey-lighter': isLastMonth,
				})}
				onClick={(event) => {
					event.stopPropagation()
					if (isLastMonth) return
					setMonthOffset((n) => n + 1)
				}}
			>
				<Icon name="caret-right" size={caretSize} />
			</div>
		</div>
	)
}

export type CalendarProps = {
	min?: Day
	max?: Day
	day: Day
	setDay: (arg: Day) => void
}

export function Calendar({
	min,
	max,
	day: selectedDay,
	setDay: setSelectedDay,
}: CalendarProps) {
	const { formatDate } = useIntl()

	const [monthOffset, setMonthOffset] = useState(0)

	const { firstDate, lastDate, dateCells, monthName, year } = useMemo(() => {
		const firstDate = new Date(selectedDay)
		firstDate.setDate(1)
		firstDate.setMonth(firstDate.getMonth() + monthOffset)

		const year = firstDate.getFullYear()
		const monthName = formatDate(firstDate, { month: 'long' })

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
				isDateOfCurrentMonth: false,
			})),
			...datesOfMonth.map((date) => ({ date, isDateOfCurrentMonth: true })),
			...datesAfterLastDate.map((date) => ({
				date,
				isDateOfCurrentMonth: false,
			})),
		]
			.map(({ date, ...rest }) => ({ day: dateToDay(date), date, ...rest }))
			.map(({ day, ...rest }) => ({
				selected: day === selectedDay,
				isSelectable:
					(min && day ? day >= min : true) && (max && day ? day <= max : true),
				day,
				...rest,
			}))
			.map(({ date, day, isDateOfCurrentMonth, isSelectable, selected }) => ({
				day,
				isDateOfCurrentMonth,
				isSelectable,
				num: date.getDate(),
				onClick(event: MouseEvent<HTMLDivElement>) {
					event.stopPropagation()
					if (isSelectable) {
						setSelectedDay(day)
						setMonthOffset(0)
					}
				},
				selected,
				// Need a random key, using day is not enough, it can raise React warning:
				//
				//     Encountered two children with the same key.
				//
				key: randomKey(),
			}))

		return { firstDate, lastDate, dateCells, monthName, year }
	}, [
		formatDate,
		min,
		max,
		monthOffset,
		selectedDay,
		setSelectedDay,
		setMonthOffset,
	])

	return (
		<div className={'calendar' satisfies Classname}>
			<CalendarHead
				isFirstMonth={Boolean(min && dateToDay(firstDate) <= min)}
				isLastMonth={Boolean(max && dateToDay(lastDate) >= max)}
				monthName={monthName}
				setMonthOffset={setMonthOffset}
				year={year}
			/>
			<CalendarWeekDays />
			<div className={'calendar__grid' satisfies Classname}>
				{dateCells.map(({ isSelectable, key, num, onClick, selected }) => (
					<div
						key={key}
						className={classnames('calendar__cell', {
							'calendar__cell--selected': selected,
							'calendar__cell--disabled': !isSelectable,
						})}
						onClick={onClick}
					>
						{num}
					</div>
				))}
				{
					/* Avoid layout shifting: in case there are 5 rows, fill with an empty row. */
					dateCells.length === 35
						? [0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i}>&nbsp;</div>)
						: null
				}
			</div>
		</div>
	)
}
