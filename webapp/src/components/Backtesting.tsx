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
	Checkbox,
	CheckboxOnChange,
	Column,
	Columns,
	Control,
	DailyInterval,
	DailyIntervalProps,
	Field,
	OneColumn,
	Title
} from "_/components/library"
import { Memory } from "_/components/Memory"
import { ProfitSummary } from "_/components/ProfitSummary"
import { StrategyOrders } from "_/components/StrategyOrders"
import { StrategyContext } from "_/contexts/Strategy"
import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { ToastContext } from "_/contexts/Toast"
import { useBacktesting } from "_/hooks/useBacktesting"
import { isFrequency } from "@workspace/models"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { classNames } from "trunx"

export const Backtesting: FC = () => {
	const { formatMessage } = useIntl()

	const { flowViewGraph } = useContext(StrategyFlowContext)
	const { strategy, strategyKey, strategyKind, strategyName } =
		useContext(StrategyContext)
	const { toast } = useContext(ToastContext)

	const {
		hasFlow,
		dispatch,
		state: {
			afterStepBehaviour,
			currentTimestamp,
			dayInterval,
			frequency,
			isDone,
			isPaused,
			isRunning,
			maxDay,
			memory,
			numSteps,
			orders,
			stepIndex
		}
	} = useBacktesting()

	let disabled = false
	if (isRunning || isPaused) disabled = true
	if (!strategy) disabled = true
	if (!hasFlow) disabled = true

	const [frequencyArg, setFrequencyArg] =
		useState<FrequencyInputProps["frequency"]>(frequency)

	const onChangePauseOnMemoryChange = useCallback<CheckboxOnChange>(
		(event) => {
			const checked = event.target.checked
			dispatch({
				type: "SET_AFTER_STEP_BEHAVIOUR",
				afterStepBehaviour: {
					...afterStepBehaviour,
					pauseOnMemoryChange: checked
				}
			})
		},
		[afterStepBehaviour, dispatch]
	)

	const onChangePauseOnNewOrder = useCallback<CheckboxOnChange>(
		(event) => {
			const checked = event.target.checked
			dispatch({
				type: "SET_AFTER_STEP_BEHAVIOUR",
				afterStepBehaviour: {
					...afterStepBehaviour,
					pauseOnNewOrder: checked
				}
			})
		},
		[afterStepBehaviour, dispatch]
	)
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
		max: numSteps
	}

	const onClickStop = useCallback(() => {
		dispatch({ type: "STOP" })
	}, [dispatch])

	const onClickStart = useCallback(() => {
		if (!flowViewGraph) return
		if (!strategyKey) return
		dispatch({
			dayInterval,
			flow: flowViewGraph,
			frequency,
			strategyName,
			strategyKey,
			type: "START"
		})
	}, [
		dayInterval,
		dispatch,
		flowViewGraph,
		frequency,
		strategyKey,
		strategyName
	])

	const onClickPause = useCallback(() => {
		dispatch({ type: "PAUSE" })
	}, [dispatch])

	const onClickResume = useCallback(() => {
		dispatch({ type: "RESUME" })
	}, [dispatch])

	useEffect(() => {
		if (!strategy) return
		const suggestedFrequency = strategy.frequency
		if (suggestedFrequency) setFrequency(suggestedFrequency)
	}, [setFrequency, strategy])

	useEffect(() => {
		if (isDone) toast.info(formatMessage({ id: "Backtesting.done" }))
	}, [formatMessage, isDone, toast])

	useEffect(() => {
		if (
			isPaused &&
			(afterStepBehaviour.pauseOnMemoryChange ||
				afterStepBehaviour.pauseOnNewOrder)
		)
			toast.warning(formatMessage({ id: "Backtesting.paused" }))
	}, [afterStepBehaviour, formatMessage, isPaused, toast])

	return (
		<>
			<Columns>
				<Column size={{ tablet: "half", fullhd: "one-third" }}>
					<Box>
						<Title>
							<FormattedMessage id="Backtesting.title" />
						</Title>

						<DailyInterval
							disabled={disabled}
							start={{ day: dayInterval.start, setDay: setStart }}
							end={{ day: dayInterval.end, setDay: setEnd }}
							max={maxDay}
						/>

						<FrequencyInput
							disabled={disabled}
							frequency={frequencyArg}
							setFrequency={setFrequency}
						/>

						<Field>
							<Control>
								<Checkbox
									className={classNames("mx-1")}
									checked={
										afterStepBehaviour.pauseOnMemoryChange
									}
									onChange={onChangePauseOnMemoryChange}
								>
									<FormattedMessage id="Backtesting.pauseOnMemoryChange" />
								</Checkbox>
							</Control>
						</Field>

						<Field>
							<Control>
								<Checkbox
									className={classNames("mx-1")}
									checked={afterStepBehaviour.pauseOnNewOrder}
									onChange={onChangePauseOnNewOrder}
								>
									<FormattedMessage id="Backtesting.pauseOnNewOrder" />
								</Checkbox>
							</Control>
						</Field>

						<BacktestingActions
							hasFlow={hasFlow}
							isPaused={isPaused}
							isRunning={isRunning}
							onClickPause={onClickPause}
							onClickResume={onClickResume}
							onClickStart={onClickStart}
							onClickStop={onClickStop}
						/>
					</Box>
				</Column>

				<Column size={{ tablet: "half", fullhd: "one-third" }}>
					<BacktestingProgress
						dayInterval={dayInterval}
						hasFlow={hasFlow}
						progress={progress}
						currentTimestamp={currentTimestamp}
					/>
				</Column>
			</Columns>

			<Columns>
				<Column size="one-third">
					<Memory memory={memory} />
				</Column>
			</Columns>

			<Columns>
				<OneColumn>
					<ProfitSummary
						orders={orders}
						dayInterval={dayInterval}
						strategyKind={strategyKind}
					/>
				</OneColumn>
			</Columns>

			<Columns>
				<Column isNarrow>
					<StrategyOrders orders={orders} />
				</Column>
			</Columns>
		</>
	)
}
