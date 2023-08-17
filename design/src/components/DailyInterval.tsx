import { FC, useCallback, useState } from "react"

import { classNames } from "../components/classNames.js"
import { DayDropdown, DayDropdownProps } from "../components/DayDropdown.js"

export type DailyIntervalProps = Pick<DayDropdownProps, "min" | "max"> & {
	start: Pick<DayDropdownProps, "day" | "label" | "setDay">
	end: Pick<DayDropdownProps, "day" | "label" | "setDay">
}

export const DailyInterval: FC<DailyIntervalProps> = ({
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
				isActive={activeDropdown === "start"}
				max={end.day}
				min={min}
				onClick={onClickStart}
				{...start}
			/>

			<DayDropdown
				close={close}
				isActive={activeDropdown === "end"}
				min={start.day}
				max={max}
				onClick={onClickEnd}
				{...end}
			/>
		</div>
	)
}
