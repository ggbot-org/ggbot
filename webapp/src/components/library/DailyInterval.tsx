import { classNames } from "_/classNames"
import { FC, useCallback, useEffect, useState } from "react"
import { useIntl } from "react-intl"

import { DayDropdown, DayDropdownProps } from "./DayDropdown"

export type DailyIntervalProps = Pick<
	DayDropdownProps,
	"disabled" | "min" | "max"
> & {
	start: Pick<DayDropdownProps, "day" | "setDay">
	end: Pick<DayDropdownProps, "day" | "setDay">
}

export const DailyInterval: FC<DailyIntervalProps> = ({
	disabled,
	min,
	max,
	start,
	end
}) => {
	const { formatMessage } = useIntl()

	const [activeDropdown, setActiveDropdown] = useState<
		"start" | "end" | undefined
	>()

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
		window.addEventListener("click", closeDropdowns)
		return () => {
			window.removeEventListener("click", closeDropdowns)
		}
	}, [closeDropdowns])

	return (
		<div className={classNames("DailyInterval")}>
			<DayDropdown
				close={closeDropdowns}
				disabled={disabled}
				isActive={activeDropdown === "start"}
				label={formatMessage({ id: "DailyInterval.from" })}
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
				label={formatMessage({ id: "DailyInterval.to" })}
				min={start.day}
				max={max}
				onClick={onClickEnd}
				{...end}
			/>
		</div>
	)
}
