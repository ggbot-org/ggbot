import { BacktestingActions } from "_/components/BacktestingActions"
import {
	BacktestingProgress,
	BacktestingProgressProps
} from "_/components/BacktestingProgress"
import {
	FrequencyInput,
	FrequencyInputProps
} from "_/components/FrequencyInput"
import {
	Box,
	Column,
	Columns,
	DailyInterval,
	DailyIntervalProps,
	Title
} from "_/components/library"
import { Memory } from "_/components/Memory"
import { ProfitSummary } from "_/components/ProfitSummary"
import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { useBacktesting } from "_/hooks/useBacktesting"
import { isFrequency } from "@workspace/models"
import { FC, useCallback, useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const Backtesting: FC = () => {
	const { formatMessage } = useIntl()

	const { flowViewGraph } = useContext(StrategyFlowContext)

	const {
		state: {
			currentTimestamp,
			dayInterval,
			frequency,
			isPaused,
			isPreparing,
			isReadOnly,
			isRunning,
			maxDay,
			memory,
			orders,
			stepIndex,
			timestamps
		},
		dispatch,
		hasRequiredData
	} = useBacktesting(flowViewGraph)

	const [frequencyArg, setFrequencyArg] =
		useState<FrequencyInputProps["frequency"]>(frequency)

	const setFrequency = useCallback<FrequencyInputProps["setFrequency"]>(
		(frequency) => {
			setFrequencyArg(frequency)
			if (isFrequency(frequency))
				dispatch({ type: "SET_FREQUENCY", data: { frequency } })
		},
		[dispatch]
	)

	const setEnd = useCallback<DailyIntervalProps["end"]["setDay"]>(
		(day) => {
			dispatch({
				type: "SET_DAY_INTERVAL",
				data: {
					dayInterval: { start: dayInterval.start, end: day }
				}
			})
		},
		[dispatch, dayInterval]
	)

	const setStart = useCallback<DailyIntervalProps["start"]["setDay"]>(
		(day) => {
			dispatch({
				type: "SET_DAY_INTERVAL",
				data: {
					dayInterval: { start: day, end: dayInterval.end }
				}
			})
		},
		[dispatch, dayInterval]
	)

	const progress: BacktestingProgressProps["progress"] = {
		value: stepIndex,
		max: timestamps.length
	}

	const onClickStop = useCallback(() => {
		dispatch({ type: "STOP" })
	}, [dispatch])

	const onClickStart = useCallback(() => {
		// TODO why this is not working? it is always false
		// if (!hasRequiredData) return
		dispatch({ type: "PREPARE" })
	}, [dispatch /*hasRequiredData*/])

	const onClickPause = useCallback(() => {
		dispatch({ type: "PAUSE" })
	}, [dispatch])

	const onClickResume = useCallback(() => {
		dispatch({ type: "RESUME" })
	}, [dispatch])

	return (
		<>
			<Columns>
				<Column size="one-third">
					<Box>
						<Title>
							<FormattedMessage id="Backtesting.title" />
						</Title>

						<DailyInterval
							start={{
								day: dayInterval.start,
								label: formatMessage({
									id: "DailyInterval.from"
								}),
								setDay: setStart
							}}
							end={{
								day: dayInterval.end,
								label: formatMessage({
									id: "DailyInterval.to"
								}),
								setDay: setEnd
							}}
							max={maxDay}
						/>

						<FrequencyInput
							frequency={frequencyArg}
							setFrequency={setFrequency}
						/>

						<BacktestingActions
							isPaused={isPaused}
							isReadOnly={isReadOnly}
							isRunning={isRunning}
							onClickPause={onClickPause}
							onClickResume={onClickResume}
							onClickStart={onClickStart}
							onClickStop={onClickStop}
						/>
					</Box>
				</Column>

				<Column size="one-third">
					<Memory memory={memory} />
				</Column>

				<Column>
					<BacktestingProgress
						dayInterval={dayInterval}
						hasRequiredData={hasRequiredData}
						isPreparing={isPreparing}
						progress={progress}
						currentTimestamp={currentTimestamp}
					/>
				</Column>
			</Columns>

			<ProfitSummary orders={orders} dayInterval={dayInterval} />
		</>
	)
}
