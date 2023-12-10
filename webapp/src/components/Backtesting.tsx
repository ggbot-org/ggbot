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
import { StrategyContext } from "_/contexts/Strategy"
import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { useBacktesting } from "_/hooks/useBacktesting"
import { isFrequency } from "@workspace/models"
import { FC, useCallback, useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const Backtesting: FC = () => {
	const { formatMessage } = useIntl()

	const { flowViewGraph } = useContext(StrategyFlowContext)
	const { strategyKey } = useContext(StrategyContext)

	const {
		state: {
			currentTimestamp,
			dayInterval,
			frequency,
			isPaused,
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
	} = useBacktesting()

	const [frequencyArg, setFrequencyArg] =
		useState<FrequencyInputProps["frequency"]>(frequency)

	const setFrequency = useCallback<FrequencyInputProps["setFrequency"]>(
		(frequency) => {
			setFrequencyArg(frequency)
			if (isFrequency(frequency))
				dispatch({ type: "SET_FREQUENCY", frequency })
		},
		[dispatch]
	)

	const setEnd = useCallback<DailyIntervalProps["end"]["setDay"]>(
		(day) => {
			dispatch({
				type: "SET_DAY_INTERVAL",
				dayInterval: { start: dayInterval.start, end: day }
			})
		},
		[dispatch, dayInterval]
	)

	const setStart = useCallback<DailyIntervalProps["start"]["setDay"]>(
		(day) => {
			dispatch({
				type: "SET_DAY_INTERVAL",
				dayInterval: { start: day, end: dayInterval.end }
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
		if (!flowViewGraph) return
		if (!strategyKey) return
		dispatch({
			type: "START",
			dayInterval,
			frequency,
			strategyKey,
			view: flowViewGraph
		})
	}, [dispatch, flowViewGraph, dayInterval, frequency, strategyKey])

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
						progress={progress}
						currentTimestamp={currentTimestamp}
					/>
				</Column>
			</Columns>

			<ProfitSummary orders={orders} dayInterval={dayInterval} />
		</>
	)
}
