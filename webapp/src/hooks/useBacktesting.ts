import { StrategyContext } from "_/contexts/Strategy"
import { ToastContext } from "_/contexts/Toast"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { useNodesCatalog } from "_/hooks/useNodesCatalog"
import { logging } from "_/logging"
import {
	BacktestingMessageIn,
	BacktestingMessageOut,
	BacktestingSession,
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
	| {
			type: "STATUS_CHANGED"
			data: Pick<BacktestingSession, "status">
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
		status: "initial",
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

const backtesting = new Worker("/workers/backtesting.js")

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

			if (["PAUSE", "RESUME", "START", "STOP"].includes(action.type)) {
				backtesting.postMessage(action)
				return state
			}

			if (action.type === "SET_DAY_INTERVAL") {
				const message: BacktestingMessageIn = {
					type: "SET_DAY_INTERVAL",
					...action.data
				}
				backtesting.postMessage(message)
				return state
			}

			if (action.type === "SET_FREQUENCY") {
				const message: BacktestingMessageIn = {
					type: "SET_FREQUENCY",
					...action.data
				}
				backtesting.postMessage(message)
				return state
			}

			if (action.type === "STATUS_CHANGED") {
				const { status } = action.data
				if (status === "done")
					toast.info(formatMessage({ id: "Backtesting.done" }))
				return {
					...state,
					status
				}
			}

			return state
		},
		getInitialState({
			frequency: defaultFrequency(),
			dayInterval: defaultDayInterval()
		})
	)

	useEffect(() => {
		backtesting.onmessage = (
			event: MessageEvent<BacktestingMessageOut>
		) => {
			const message = event.data
			if (message.type === "STATUS_CHANGED")
				dispatch({
					type: "STATUS_CHANGED",
					data: { status: message.status }
				})
		}

		return () => {
			backtesting.terminate()
		}
	}, [dispatch])

	return { state, dispatch, hasRequiredData }
}

export type BacktestingOutput = ReturnType<typeof useBacktesting>
