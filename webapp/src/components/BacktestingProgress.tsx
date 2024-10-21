import { classnames } from "_/classnames"
import { Div, Progress, ProgressProps } from "_/components/library"
import { UseBacktestingState } from "_/hooks/useBacktesting"
import { timeFormat } from "_/i18n/formats"
import { FormattedMessage, useIntl } from "react-intl"

export type BacktestingProgressProps = Pick<
	UseBacktestingState, "currentTimestamp"
> & {
	progress: Pick<ProgressProps, "value" | "max">
}

export function BacktestingProgress({ progress, currentTimestamp }: BacktestingProgressProps) {
	const { formatDate } = useIntl()
	return (
		<Div bulma="block">
			<Progress size="small" {...progress} />
			<Div bulma={["is-flex", "my-2", "is-flex-direction-column"]}>
				<div className={classnames("backtesting-progress__info")}>
					{progress.max ? (<FormattedMessage id="BacktestingProgress.intervals" values={progress} />) : null}
				</div>
				<div className={classnames("backtesting-progress__info")}>
					{currentTimestamp ? (
						<FormattedMessage
							id="BacktestingProgress.currentTime"
							values={{ time: formatDate(currentTimestamp, timeFormat) }}
						/>
					) : null}
				</div>
			</Div>
		</Div>
	)
}

