import { StrategyContext } from "_/contexts/Strategy"
import { ToastContext } from "_/contexts/Toast"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { useNodesCatalog } from "_/hooks/useNodesCatalog"
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
	isPreparing: boolean
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

const backtesting = new Worker(`/${ecmaScriptPath.backtesting.join("/")}`)

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
					"SET_FREQUENCY"
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
