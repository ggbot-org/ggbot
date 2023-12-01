import { StrategyContext } from "_/contexts/Strategy"
import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { ToastContext } from "_/contexts/Toast"
import { logging } from "_/logging"
import {
	BacktestingMessageInData,
	BacktestingMessageOutData,
	BacktestingStatus
} from "@workspace/backtesting"
import { DflowCommonContext } from "@workspace/dflow"
import {
	BalanceChangeEvent,
	everyOneHour,
	Frequency,
	frequencyIntervalDuration,
	Order
} from "@workspace/models"
import {
	dateToTimestamp,
	Day,
	DayInterval,
	dayIntervalToDate,
	getDay,
	Timestamp,
	yesterday
} from "minimal-time-helpers"
import { Reducer, useContext, useEffect, useReducer } from "react"
import { useIntl } from "react-intl"

import { ecmaScriptPath } from "../ecmaScripts"

const { info } = logging("backtesting")

type State = Pick<DflowCommonContext, "memory"> & {
	status: BacktestingStatus
	balanceHistory: BalanceChangeEvent[]
	currentTimestamp: Timestamp | undefined
	dayInterval: DayInterval
	frequency: Frequency
	isPaused: boolean
	isRunning: boolean
	isReadOnly: boolean
	maxDay: Day
	orders: Order[]
	stepIndex: number
	timestamps: Timestamp[]
}

export type { State as BacktestingState }

const getMaxDay: () => State["maxDay"] = yesterday

const defaultDayInterval = (): State["dayInterval"] => {
	const maxDay = getMaxDay()
	return {
		start: getDay(maxDay).minus(7).days,
		end: maxDay
	}
}

const defaultFrequency = (): State["frequency"] => everyOneHour()

const getInitialState = ({
	frequency,
	dayInterval
}: Pick<State, "frequency" | "dayInterval">): State => {
	// Compute timestamps.
	const { start, end } = dayIntervalToDate(dayInterval)
	const interval = frequencyIntervalDuration(frequency)
	const timestamps: Timestamp[] = []
	let date = start
	while (date < end) {
		timestamps.push(dateToTimestamp(date))
		date = new Date(date.getTime() + interval)
	}

	return {
		balanceHistory: [],
		status: "initial",
		currentTimestamp: undefined,
		dayInterval,
		frequency,
		isPaused: false,
		isReadOnly: false,
		isRunning: false,
		maxDay: getMaxDay(),
		memory: {},
		orders: [],
		stepIndex: 0,
		timestamps
	}
}

const backtesting = new Worker(`/${ecmaScriptPath.backtesting.join("/")}`)

export const useBacktesting = () => {
	const { formatMessage } = useIntl()

	const { strategyKey } = useContext(StrategyContext)
	const { flowViewGraph } = useContext(StrategyFlowContext)
	const { toast } = useContext(ToastContext)

	let hasRequiredData = true
	if (!flowViewGraph) hasRequiredData = false

	const [state, dispatch] = useReducer<
		Reducer<State, BacktestingMessageInData | BacktestingMessageOutData>
	>(
		(state, action) => {
			info(action.type)

			if (
				[
					"PAUSE",
					"RESUME",
					"START",
					"STOP",
					"SET_DAY_INTERVAL",
					"SET_FREQUENCY",
					"SET_STRATEGY",
					"SET_STRATEGY_VIEW"
				].includes(action.type)
			) {
				backtesting.postMessage(action)
				return state
			}

			if (action.type === "STATUS_CHANGED") {
				const { status } = action
				if (status === "done")
					toast.info(formatMessage({ id: "Backtesting.done" }))
				return {
					...state,
					status
				}
			}

			if (action.type === "UPDATED_DAY_INTERVAL")
				return {
					...state,
					dayInterval: action.dayInterval
				}

			if (action.type === "UPDATED_FREQUENCY")
				return {
					...state,
					frequency: action.frequency
				}

			return state
		},
		getInitialState({
			frequency: defaultFrequency(),
			dayInterval: defaultDayInterval()
		})
	)

	useEffect(() => {
		if (!strategyKey) return
		dispatch({ type: "SET_STRATEGY_KEY", strategyKey })
	}, [dispatch, strategyKey])

	useEffect(() => {
		if (!strategyKey) return
		if (!flowViewGraph) return
		dispatch({ type: "SET_STRATEGY_VIEW", view: flowViewGraph })
	}, [dispatch, flowViewGraph, strategyKey])

	useEffect(() => {
		backtesting.onmessage = ({
			data: action
		}: MessageEvent<BacktestingMessageOutData>) => {
			dispatch(action)
		}

		return () => {
			backtesting.terminate()
		}
	}, [dispatch])

	return { state, dispatch, hasRequiredData }
}

export type BacktestingOutput = ReturnType<typeof useBacktesting>
