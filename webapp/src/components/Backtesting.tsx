import { classnames } from "_/classnames"
import { BacktestingActions } from "_/components/BacktestingActions"
import { BacktestingProgress, BacktestingProgressProps } from "_/components/BacktestingProgress"
import { FrequencyInput, FrequencyInputProps } from "_/components/FrequencyInput"
import { Checkbox, Column, Columns, Control, DayInterval, DayIntervalProps, Div, Field, OneColumn, Title } from "_/components/library"
import { Memory } from "_/components/Memory"
import { ProfitSummary } from "_/components/ProfitSummary"
import { StrategyOrdersTable } from "_/components/StrategyOrdersTable"
import { SchedulingParameters } from "_/components/user/SchedulingParameters"
import { ToastContext } from "_/contexts/Toast"
import { useBacktesting } from "_/hooks/useBacktesting"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { Frequency, isFrequency, StrategyKey } from "@workspace/models"
import { ChangeEventHandler, InputHTMLAttributes, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type Props = {
	strategyFrequency: Frequency | undefined
	strategyKey: StrategyKey | undefined
	strategyName: string
}

export function Backtesting({ strategyKey, strategyName, strategyFrequency }: Props) {
	const { formatMessage } = useIntl()

	const { toast } = useContext(ToastContext)

	const { strategyFlow } = useStrategyFlow(strategyKey)
	const flowViewGraph = strategyFlow?.view

	const hasFlow = Boolean(flowViewGraph)

	const {
		dispatch,
		state: {
			afterStepBehaviour, currentTimestamp, dayInterval, frequency, isDone, isPaused, isRunning, maxDay, memory, numSteps, orders, stepIndex
		}
	} = useBacktesting()

	let disabled = false
	if (isRunning || isPaused) disabled = true
	if (!hasFlow) disabled = true

	const [frequencyArg, setFrequencyArg] = useState<FrequencyInputProps["frequency"]>(frequency)

	const onChangePauseOnMemoryChange = useCallback< ChangeEventHandler<HTMLInputElement> >((event) => {
		const { checked } = event.target as unknown as InputHTMLAttributes<HTMLInputElement>
		dispatch({ type: "SET_AFTER_STEP_BEHAVIOUR", afterStepBehaviour: { ...afterStepBehaviour, pauseOnMemoryChange: Boolean(checked) } })
	}, [afterStepBehaviour, dispatch])

	const onChangePauseOnNewOrder = useCallback< ChangeEventHandler<HTMLInputElement> >((event) => {
		const { checked } = event.target as unknown as InputHTMLAttributes<HTMLInputElement>
		if (checked === undefined) return
		dispatch({ type: "SET_AFTER_STEP_BEHAVIOUR", afterStepBehaviour: { ...afterStepBehaviour, pauseOnNewOrder: checked } })
	}, [afterStepBehaviour, dispatch])

	const setFrequency = useCallback<FrequencyInputProps["setFrequency"]>((frequency) => {
		setFrequencyArg(frequency)
		if (isFrequency(frequency)) dispatch({ type: "SET_FREQUENCY", frequency })
	}, [dispatch])

	const setEnd = useCallback<DayIntervalProps["end"]["setDay"]>((day) => {
		dispatch({ type: "SET_DAY_INTERVAL", dayInterval: { start: dayInterval.start, end: day } })
	}, [dispatch, dayInterval])

	const setStart = useCallback<DayIntervalProps["start"]["setDay"]>((day) => {
		dispatch({ type: "SET_DAY_INTERVAL", dayInterval: { start: day, end: dayInterval.end } })
	}, [dispatch, dayInterval])

	const progress: BacktestingProgressProps["progress"] = { value: stepIndex, max: numSteps }

	const onClickStop = useCallback(() => {
		dispatch({ type: "STOP" })
	}, [dispatch])

	const onClickStart = useCallback(() => {
		if (!flowViewGraph) return
		if (!strategyKey || !strategyName) return
		dispatch({ type: "START", dayInterval, flow: flowViewGraph, frequency, strategyName, strategyKey })
	}, [dayInterval, dispatch, flowViewGraph, frequency, strategyKey, strategyName])

	const onClickPause = useCallback(() => {
		dispatch({ type: "PAUSE" })
	}, [dispatch])

	const onClickResume = useCallback(() => {
		dispatch({ type: "RESUME" })
	}, [dispatch])

	// Backtesting frequency defaults to the suggested frequency, if found in the strategy.
	useEffect(() => {
		if (!strategyFrequency) return
		setFrequency(strategyFrequency)
	}, [setFrequency, strategyFrequency])

	useEffect(() => {
		if (isDone) toast.info(formatMessage({ id: "Backtesting.done" }))
	}, [formatMessage, isDone, toast])

	useEffect(() => {
		if (isPaused && (afterStepBehaviour.pauseOnMemoryChange || afterStepBehaviour.pauseOnNewOrder)) {
			toast.warning(formatMessage({ id: "Backtesting.paused" }))
		}
	}, [afterStepBehaviour, formatMessage, isPaused, toast])

	return (
		<>
			<Columns>
				<Column bulma={["is-half-tablet", "is-one-third-fullhd"]}>
					<Div bulma="box">
						<Title>
							<FormattedMessage id="Backtesting.title" />
						</Title>

						<DayInterval
							disabled={disabled}
							end={{ day: dayInterval.end, setDay: setEnd }}
							max={maxDay}
							start={{ day: dayInterval.start, setDay: setStart }}
						/>

						<FrequencyInput
							disabled={disabled}
							frequency={frequencyArg}
							setFrequency={setFrequency}
						/>

						<Field>
							<Control>
								<Checkbox
									checked={
										afterStepBehaviour.pauseOnMemoryChange
									}
									className={classnames("mx-1")}
									onChange={onChangePauseOnMemoryChange}
								>
									<FormattedMessage id="Backtesting.pauseOnMemoryChange" />
								</Checkbox>
							</Control>
						</Field>

						<Field>
							<Control>
								<Checkbox
									checked={afterStepBehaviour.pauseOnNewOrder}
									className={classnames("mx-1")}
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
					</Div>
				</Column>

				<Column bulma={["is-half-tablet", "is-one-third-fullhd"]}>
					<BacktestingProgress
						currentTimestamp={currentTimestamp}
						dayInterval={dayInterval}
						progress={progress}
					/>
				</Column>
			</Columns>

			<Columns>
				<Column bulma="is-one-third">
					<SchedulingParameters
						flowViewGraph={flowViewGraph}
						params={undefined}
						setParam={() => {
							// TODO
						}}
					/>
				</Column>

				<Column bulma="is-one-third">
					<Memory memory={memory} />
				</Column>
			</Columns>

			<Columns>
				<OneColumn>
					<ProfitSummary
						dayInterval={dayInterval}
						orders={orders}
						strategyKind={strategyKey?.strategyKind}
					/>
				</OneColumn>
			</Columns>

			<Columns>
				<Column bulma="is-narrow">
					<StrategyOrdersTable orders={orders} />
				</Column>
			</Columns>
		</>
	)
}
