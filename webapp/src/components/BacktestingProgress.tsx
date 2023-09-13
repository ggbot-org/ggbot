import { Box, Flex, Progress, ProgressProps, Title } from "_/components/library"
import type {
	BacktestingOutput,
	BacktestingState
} from "_/hooks/useBacktesting"
import { dayFormat, timeFormat } from "_/i18n/formats"
import { FC } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export type BacktestingProgressProps = Pick<
	BacktestingState,
	"currentTimestamp" | "dayInterval" | "isPreparing"
> &
	Pick<BacktestingOutput, "hasRequiredData"> & {
		progress: Pick<ProgressProps, "value" | "max">
	}

export const BacktestingProgress: FC<BacktestingProgressProps> = ({
	dayInterval,
	hasRequiredData,
	isPreparing,
	progress,
	currentTimestamp
}) => {
	const { formatDate } = useIntl()

	if (!hasRequiredData)
		return (
			<Box>
				<Title>
					<FormattedMessage id="BacktestingProgress.title" />
				</Title>

				<Progress />

				<FormattedMessage
					id="BacktestingProgress.waiting"
					values={progress}
				/>
			</Box>
		)

	return (
		<Box>
			<Title>
				<FormattedMessage id="BacktestingProgress.title" />
			</Title>

			{isPreparing ? (
				<>
					<Progress />

					<FormattedMessage
						id="BacktestingProgress.preparing"
						values={progress}
					/>
				</>
			) : (
				<>
					<Progress {...progress} />

					<FormattedMessage
						id="BacktestingProgress.intervals"
						values={progress}
					/>
				</>
			)}

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
