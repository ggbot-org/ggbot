import { classnames } from "_/classnames"
import { useCallback, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

import { DayDropdown, DayDropdownProps } from "./DayDropdown"

export type DayIntervalProps = Pick<
	DayDropdownProps,
	"disabled" | "min" | "max"
> & {
	start: Pick<DayDropdownProps, "day" | "setDay">
	end: Pick<DayDropdownProps, "day" | "setDay">
}

export function DayInterval({ disabled, min, max, start, end }: DayIntervalProps) {
	const [activeDropdown, setActiveDropdown] = useState<"start" | "end" | undefined>()

	const closeDropdowns = useCallback<DayDropdownProps["close"]>(() => {
		setActiveDropdown(undefined)
	}, [])

	const onClickStart = useCallback<DayDropdownProps["onClick"]>((event) => {
		event.stopPropagation()
		setActiveDropdown((activeDropdown) => {
			if (activeDropdown === "start") return undefined
			return "start"
		})
	}, [])

	const onClickEnd = useCallback<DayDropdownProps["onClick"]>((event) => {
		event.stopPropagation()
		setActiveDropdown((activeDropdown) => {
			if (activeDropdown === "end") return undefined
			return "end"
		})
	}, [])

	// Close both day dropdowns on outside click.
	useEffect(() => {
		addEventListener("click", closeDropdowns)
		return () => {
			removeEventListener("click", closeDropdowns)
		}
	}, [closeDropdowns])

	return (
		<div className={classnames("day-interval")}>
			<DayDropdown
				close={closeDropdowns}
				disabled={disabled}
				isActive={activeDropdown === "start"}
				label={<FormattedMessage id="DailyInterval.from" />}
				max={end.day}
				min={min}
				onClick={onClickStart}
				{...start}
			/>
			<DayDropdown
				isRight
				close={closeDropdowns}
				disabled={disabled}
				isActive={activeDropdown === "end"}
				label={<FormattedMessage id="DailyInterval.to" />}
				max={max}
				min={start.day}
				onClick={onClickEnd}
				{...end}
			/>
		</div>
	)
}
