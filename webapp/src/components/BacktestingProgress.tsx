import { classnames } from "_/classnames"
import { Div, Progress, ProgressProps, Title } from "_/components/library"
import type { UseBacktestingOutput } from "_/hooks/useBacktesting"
import { dayFormat, timeFormat } from "_/i18n/formats"
import { FormattedMessage, useIntl } from "react-intl"

export type BacktestingProgressProps = Pick<
	UseBacktestingOutput["state"],
	"currentTimestamp" | "dayInterval"
> & {
	progress: Pick<ProgressProps, "value" | "max">
}

export function BacktestingProgress({
	dayInterval,
	progress,
	currentTimestamp
}: BacktestingProgressProps) {
	const { formatDate, formatMessage } = useIntl()

	return (
		<Div bulma="box">
			<Title>{formatMessage({ id: "BacktestingProgress.title" })}</Title>

			<Progress {...progress} />

			<div
				className={classnames(
					"is-flex",
					"my-2",
					"is-flex-direction-column"
				)}
			>
				<div className={classnames("is-flex")}>
					<FormattedMessage
						id="BacktestingProgress.dayInterval"
						values={{
							start: formatDate(dayInterval.start, dayFormat),
							end: formatDate(dayInterval.end, dayFormat)
						}}
					/>
				</div>

				{progress.max ? (
					<FormattedMessage
						id="BacktestingProgress.intervals"
						values={progress}
					/>
				) : null}

				{currentTimestamp ? (
					<div className={classnames("is-flex")}>
						<FormattedMessage
							id="BacktestingProgress.currentTime"
							values={{
								time: formatDate(currentTimestamp, timeFormat)
							}}
						/>
					</div>
				) : null}
			</div>
		</Div>
	)
}
