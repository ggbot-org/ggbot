import { DayInterval, DayIntervalProps } from '_/components/library/DayInterval'
import { FormattedMessage } from '_/i18n/components'
import { Day } from 'minimal-time-helpers'
import { Button, ButtonProps, Buttons, Div, Title } from 'trunx'

export function DayIntervalBox({
	onClickUpdate,
	isLoading,
	start,
	end,
	min,
	max,
	setStart,
	setEnd,
}: Pick<ButtonProps, 'isLoading'> &
	Pick<DayIntervalProps, 'min' | 'max'> & {
		onClickUpdate: ButtonProps['onClick']
		start: Day
		end: Day
		setStart: (day: Day) => void
		setEnd: (day: Day) => void
	}) {
	return (
		<Div bulma={['box', { 'is-skeleton': isLoading }]}>
			<Title>
				<FormattedMessage id="DailyIntervalBox.title" />
			</Title>
			<DayInterval
				disabled={isLoading}
				end={{ day: end, setDay: setEnd }}
				max={max}
				min={min}
				start={{ day: start, setDay: setStart }}
			/>
			<Buttons>
				<Button isLoading={isLoading} onClick={onClickUpdate}>
					<FormattedMessage id="DailyIntervalBox.update" />
				</Button>
			</Buttons>
		</Div>
	)
}
