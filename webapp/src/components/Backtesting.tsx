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
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import {
	SchedulingParameters,
	SchedulingParametersProps
} from "_/components/user/SchedulingParameters"
import { StrategyContext } from "_/contexts/Strategy"
import { ToastContext } from "_/contexts/Toast"
import { useBacktesting } from "_/hooks/useBacktesting"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { isFrequency } from "@workspace/models"
import {
	ChangeEventHandler,
	InputHTMLAttributes,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { classNames } from "trunx"

export function Backtesting() {
	const { formatMessage } = useIntl()

	const strategyKey = useStrategyKey()
	const { strategy, strategyKind, strategyName } = useContext(StrategyContext)
	const { toast } = useContext(ToastContext)

	const binanceSymbols = useBinanceSymbols()

	const flowViewGraph = useStrategyFlow(strategyKey)

	const hasFlow = Boolean(flowViewGraph)

	const {
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

	const setParam: SchedulingParametersProps["setParam"] = () => {}

	const onChangePauseOnMemoryChange = useCallback<
		ChangeEventHandler<HTMLInputElement>
	>(
		(event) => {
			const { checked } =
				event.target as unknown as InputHTMLAttributes<HTMLInputElement>
			dispatch({
				type: "SET_AFTER_STEP_BEHAVIOUR",
				afterStepBehaviour: {
					...afterStepBehaviour,
					pauseOnMemoryChange: Boolean(checked)
				}
			})
		},
		[afterStepBehaviour, dispatch]
	)

	const onChangePauseOnNewOrder = useCallback<
		ChangeEventHandler<HTMLInputElement>
	>(
		(event) => {
			const { checked } =
				event.target as unknown as InputHTMLAttributes<HTMLInputElement>
			if (checked === undefined) return
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
							canStart={hasFlow}
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
						progress={progress}
						currentTimestamp={currentTimestamp}
					/>
				</Column>
			</Columns>

			<Columns>
				<Column size="one-third">
					<SchedulingParameters
						binanceSymbols={binanceSymbols}
						flowViewGraph={flowViewGraph}
						setParam={setParam}
						params={undefined}
					/>
				</Column>

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
					<StrategyOrdersTable orders={orders} />
				</Column>
			</Columns>
		</>
	)
}
