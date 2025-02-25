import { Classname } from '_/classnames'
import { Div, Progress } from '_/components/library'
import { UseBacktestingState } from '_/hooks/useBacktesting'
import { FormattedMessage } from '_/i18n/components'
import { timeFormat } from '_/i18n/formats'
import { useIntl } from '_/i18n/hooks'

export type BacktestingProgressProps = Pick<
	UseBacktestingState,
	'currentTimestamp'
> &
	Partial<{
		progress: {
			max: number
			value: number
		}
	}>

export function BacktestingProgress({
	progress,
	currentTimestamp,
}: BacktestingProgressProps) {
	const { formatDate } = useIntl()
	return (
		<Div bulma={['my-2', 'mx-1']}>
			<div className={'backtesting-progress__info' satisfies Classname}>
				{progress ? (
					<FormattedMessage
						id="BacktestingProgress.intervals"
						values={progress}
					/>
				) : null}
			</div>
			<div className={'backtesting-progress__info' satisfies Classname}>
				{currentTimestamp ? (
					<FormattedMessage
						id="BacktestingProgress.currentTime"
						values={{ time: formatDate(currentTimestamp, timeFormat) }}
					/>
				) : null}
			</div>
			<div className={'backtesting-progress__info' satisfies Classname}>
				{progress ? <Progress size="small" {...progress} /> : null}
			</div>
		</Div>
	)
}
