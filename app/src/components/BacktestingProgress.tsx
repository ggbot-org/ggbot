import {
	Box,
	dayFormat,
	Flex,
	Progress,
	ProgressProps,
	timeFormat,
	Title
} from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import type {
	BacktestingOutput,
	BacktestingState
} from "../hooks/useBacktesting"

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

	return (
		<Box>
			<Title>
				<FormattedMessage id="BacktestingProgress.title" />
			</Title>

			{hasRequiredData === true ? (
				isPreparing ? (
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
				)
			) : (
				<>
					<Progress />

					<FormattedMessage
						id="BacktestingProgress.waiting"
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
