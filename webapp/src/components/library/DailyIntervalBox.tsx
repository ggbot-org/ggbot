import { Day } from "minimal-time-helpers"
import { Dispatch, FC, SetStateAction, useCallback } from "react"
import { FormattedMessage } from "react-intl"
import { Button, ButtonProps, Buttons, Div, Title } from "trunx"

import { DailyInterval } from "./DailyInterval"

type DailyIntervalBoxProps = Pick<ButtonProps, "isLoading"> & {
	onClickUpdate: ButtonProps["onClick"]
	start: Day
	end: Day
	setStart: Dispatch<SetStateAction<Day>>
	setEnd: Dispatch<SetStateAction<Day>>
}

export const DailyIntervalBox: FC<DailyIntervalBoxProps> = ({
	onClickUpdate,
	isLoading,
	start,
	end,
	setStart,
	setEnd
}) => {
	const setStartDay = useCallback(
		(day: Day) => {
			if (isLoading) return
			setStart(day)
		},
		[isLoading, setStart]
	)

	const setEndDay = useCallback(
		(day: Day) => {
			if (isLoading) return
			setEnd(day)
		},
		[isLoading, setEnd]
	)

	return (
		<Div bulma="box">
			<Title>
				<FormattedMessage id="DailyIntervalBox.title" />
			</Title>

			<DailyInterval
				start={{ day: start, setDay: setStartDay }}
				end={{ day: end, setDay: setEndDay }}
			/>

			<Buttons>
				<Button onClick={onClickUpdate} isLoading={isLoading}>
					<FormattedMessage id="DailyIntervalBox.update" />
				</Button>
			</Buttons>
		</Div>
	)
}
