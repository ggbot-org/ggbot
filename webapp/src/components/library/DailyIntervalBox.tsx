// TODO move this outside of components library
// TODO use session storage to persist choosen daily interval
import { Day } from "minimal-time-helpers"
import { Dispatch, SetStateAction, useCallback } from "react"
import { FormattedMessage } from "react-intl"
import { Button, ButtonProps, Buttons, Div, Title } from "trunx"

import { DailyInterval } from "./DailyInterval"

type Props = Pick<ButtonProps, "isLoading"> & {
	onClickUpdate: ButtonProps["onClick"]
	start: Day
	end: Day
	setStart: Dispatch<SetStateAction<Day>>
	setEnd: Dispatch<SetStateAction<Day>>
}

export function DailyIntervalBox({
	onClickUpdate,
	isLoading,
	start,
	end,
	setStart,
	setEnd
}: Props) {
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
