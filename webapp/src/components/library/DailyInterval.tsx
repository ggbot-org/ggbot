import { classNames } from "_/classNames"
import { FC, useCallback, useState } from "react"

import { DayDropdown, DayDropdownProps } from "./DayDropdown"

export type DailyIntervalProps = Pick<
	DayDropdownProps,
	"disabled" | "min" | "max"
> & {
	start: Pick<DayDropdownProps, "day" | "label" | "setDay">
	end: Pick<DayDropdownProps, "day" | "label" | "setDay">
}

export const DailyInterval: FC<DailyIntervalProps> = ({
	disabled,
	min,
	max,
	start,
	end
}) => {
	const [activeDropdown, setActiveDropdown] = useState<
		"start" | "end" | undefined
	>()

	const close = useCallback<DayDropdownProps["close"]>(() => {
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

	return (
		<div className={classNames("DailyInterval")}>
			<DayDropdown
				close={close}
				disabled={disabled}
				isActive={activeDropdown === "start"}
				max={end.day}
				min={min}
				onClick={onClickStart}
				{...start}
			/>

			<DayDropdown
				isRight
				close={close}
				disabled={disabled}
				isActive={activeDropdown === "end"}
				min={start.day}
				max={max}
				onClick={onClickEnd}
				{...end}
			/>
		</div>
	)
}
