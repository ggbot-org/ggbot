import { StrategyContext } from "_/contexts/Strategy"
import { ToastContext } from "_/contexts/Toast"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { useNodesCatalog } from "_/hooks/useNodesCatalog"
import { logging } from "_/logging"
import {
	BacktestingMessageIn,
	BacktestingMessageOut,
	BacktestingStatus
} from "@workspace/backtesting"
import { DflowCommonContext } from "@workspace/dflow"
import {
	BalanceChangeEvent,
	everyOneHour,
	Frequency,
	frequencyIntervalDuration,
	Order} from "@workspace/models"
import { FlowViewSerializableGraph } from "flow-view"
import {
	dateToTimestamp,
	Day,
	DayInterval,
	dayIntervalToDate,
	getDay,
	Timestamp,
	yesterday
} from "minimal-time-helpers"
import { useContext, useEffect, useReducer } from "react"
import { useIntl } from "react-intl"

const { info } = logging("backtesting")

type State = Pick<DflowCommonContext, "memory"> & {
	status: BacktestingStatus
	balanceHistory: BalanceChangeEvent[]
	currentTimestamp: Timestamp | undefined
	dayInterval: DayInterval
	frequency: Frequency
	isPaused: boolean
	isPreparing: boolean
	isRunning: boolean
	isReadOnly: boolean
	maxDay: Day
	orders: Order[]
	stepIndex: number
	timestamps: Timestamp[]
}

export type { State as BacktestingState }

type Action =
	| {
			type: "DONE"
	  }
	| {
			type: "PAUSE"
	  }
	| {
			type: "PREPARE"
	  }
	| {
			type: "RESUME"
	  }
	| {
			type: "SET_FREQUENCY"
			data: Pick<State, "frequency">
	  }
	| {
			type: "SET_DAY_INTERVAL"
			data: Pick<State, "dayInterval">
	  }
	| {
			type: "START"
	  }
	| {
			type: "STOP"
	  }

const isReadOnlyState = (
	state: Pick<State, "isRunning" | "isPaused" | "isPreparing">
) => {
	if (state.isRunning || state.isPaused || state.isPreparing) return true
	return false
}

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
		status: "ready",
		currentTimestamp: undefined,
		dayInterval,
		frequency,
		isPaused: false,
		isPreparing: false,
		isReadOnly: false,
		isRunning: false,
		maxDay: getMaxDay(),
		memory: {},
		orders: [],
		stepIndex: 0,
		timestamps
	}
}

const backtesting = new SharedWorker("/workers/backtesting.js")

export const useBacktesting = (
	flowViewGraph: FlowViewSerializableGraph | undefined
) => {
	const { formatMessage } = useIntl()

	const { toast } = useContext(ToastContext)
	const { strategy } = useContext(StrategyContext)

	const binanceSymbols = useBinanceSymbols()
	const nodesCatalog = useNodesCatalog()

	let hasRequiredData = true
	if (!nodesCatalog) hasRequiredData = false
	if (!flowViewGraph) hasRequiredData = false
	if (strategy?.kind === "binance" && !binanceSymbols) hasRequiredData = false

	const [state, dispatch] = useReducer(
		(state: State, action: Action) => {
			info(action.type)

			if (action.type === "DONE") {
				toast.info(formatMessage({ id: "Backtesting.done" }))
				return state
			}

			switch (action.type) {
				case "PAUSE": {
					const message: BacktestingMessageIn = {
						type: "PAUSE"
					}
					backtesting.port.postMessage(message)
					return {
						...state,
						isPaused: true,
						isRunning: false
					}
				}

				case "RESUME": {
					return state.isPaused
						? {
								...state,
								isPaused: false,
								isRunning: true
						  }
						: state
				}

				case "SET_FREQUENCY": {
					if (isReadOnlyState(state))
						return { ...state, isReadOnly: true }
					const { frequency } = action.data
					return getInitialState({
						frequency,
						dayInterval: state.dayInterval
					})
				}

				case "SET_DAY_INTERVAL": {
					if (isReadOnlyState(state))
						return { ...state, isReadOnly: true }
					const { dayInterval } = action.data
					return getInitialState({
						frequency: state.frequency,
						dayInterval
					})
				}

				// TODO remove this?
				case "PREPARE": {
					const stepIndex = 0
					return {
						...state,
						balanceHistory: [],
						currentTimestamp: state.timestamps[stepIndex],
						isPaused: false,
						isPreparing: true,
						isRunning: false,
						memory: {},
						orders: [],
						stepIndex
					}
				}

				case "START": {
					const message: BacktestingMessageIn = {
						type: "START"
					}
					backtesting.port.postMessage(message)
					return {
						...state,
						isPreparing: false,
						isRunning: true
					}
				}

				case "STOP": {
					const message: BacktestingMessageIn = {
						type: "STOP"
					}
					backtesting.port.postMessage(message)
					return getInitialState({
						frequency: state.frequency,
						dayInterval: state.dayInterval
					})
				}

				default:
					return state
			}
		},
		getInitialState({
			frequency: defaultFrequency(),
			dayInterval: defaultDayInterval()
		})
	)

	useEffect(() => {
		backtesting.port.onmessage = (
			event: MessageEvent<BacktestingMessageOut>
		) => {
			const messageType = event.data.type
			if (messageType === "DONE") {
				dispatch({ type: "DONE" })
			}
		}
	}, [dispatch])

	return { state, dispatch, hasRequiredData }
}

export type BacktestingOutput = ReturnType<typeof useBacktesting>
