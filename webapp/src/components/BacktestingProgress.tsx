import { Box, Flex, Progress, ProgressProps, Title } from "_/components/library"
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
		<Box>
			<Title>{formatMessage({ id: "BacktestingProgress.title" })}</Title>

			<Progress {...progress} />

			<Flex direction="column" spacing={{ my: 2 }}>
				<Flex>
					<FormattedMessage
						id="BacktestingProgress.dayInterval"
						values={{
							start: formatDate(dayInterval.start, dayFormat),
							end: formatDate(dayInterval.end, dayFormat)
						}}
					/>
				</Flex>

				{progress.max ? (
					<FormattedMessage
						id="BacktestingProgress.intervals"
						values={progress}
					/>
				) : null}

				{currentTimestamp ? (
					<Flex>
						<FormattedMessage
							id="BacktestingProgress.currentTime"
							values={{
								time: formatDate(currentTimestamp, timeFormat)
							}}
						/>
					</Flex>
				) : null}
			</Flex>
		</Box>
	)
}
