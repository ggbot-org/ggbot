import { Day } from "minimal-time-helpers"
import { FormattedMessage } from "react-intl"
import { Button, ButtonProps, Buttons, Div, Title } from "trunx"

import { DayInterval, DayIntervalProps } from "./DayInterval"

type Props = Pick<ButtonProps, "isLoading"> &
	Pick<DayIntervalProps, "min" | "max"> & {
		onClickUpdate: ButtonProps["onClick"]
		start: Day
		end: Day
		setStart: (day: Day) => void
		setEnd: (day: Day) => void
	}

export function DayIntervalBox({
	onClickUpdate,
	isLoading,
	start,
	end,
	min,
	max,
	setStart,
	setEnd
}: Props) {

	return (
		<Div bulma={["box", { "is-skeleton": isLoading }]}>
			<Title>
				<FormattedMessage id="DailyIntervalBox.title" />
			</Title>

			<DayInterval
				disabled={isLoading}
				min={min}
				max={max}
				start={{ day: start, setDay: setStart }}
				end={{ day: end, setDay: setEnd }}
			/>

			<Buttons>
				<Button onClick={onClickUpdate} isLoading={isLoading}>
					<FormattedMessage id="DailyIntervalBox.update" />
				</Button>
			</Buttons>
		</Div>
	)
}
