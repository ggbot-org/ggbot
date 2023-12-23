import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { ToastContext } from "_/contexts/Toast"
import { logging } from "_/logging"
import {
	BacktestingMessageInData,
	BacktestingMessageOutData
} from "@workspace/backtesting"
import { DflowCommonContext } from "@workspace/dflow"
import {
	BalanceChangeEvent,
	everyOneHour,
	Frequency,
	Order
} from "@workspace/models"
import {
	Day,
	DayInterval,
	getDay,
	Timestamp,
	yesterday
} from "minimal-time-helpers"
import { Dispatch, Reducer, useContext, useEffect, useReducer } from "react"
import { useIntl } from "react-intl"

import { ecmaScriptPath } from "../ecmaScripts"

type Action =
	| BacktestingMessageInData
	| BacktestingMessageOutData
	| {
			type: "INITALIZED"
	  }

type State = Pick<DflowCommonContext, "memory"> & {
	balanceHistory: BalanceChangeEvent[]
	currentTimestamp: Timestamp | undefined
	dayInterval: DayInterval
	frequency: Frequency
	isPaused: boolean
	isRunning: boolean
	maxDay: Day
	orders: Order[]
	numSteps: number
	stepIndex: number
}

export type UseBacktestingOutput = {
	state: State
	dispatch: Dispatch<Action>
	hasRequiredData: boolean
}

const { info } = logging("backtesting")

const backtesting = new Worker(`/${ecmaScriptPath.backtesting.join("/")}`)

const getMaxDay: () => State["maxDay"] = yesterday

const defaultDayInterval = (): State["dayInterval"] => {
	const maxDay = getMaxDay()
	return {
		start: getDay(maxDay).minus(7).days,
		end: maxDay
	}
}

const defaultFrequency = (): State["frequency"] => everyOneHour()

const initializer = ({
	frequency,
	dayInterval
}: Pick<State, "frequency" | "dayInterval">): State => ({
		balanceHistory: [],
		currentTimestamp: undefined,
		dayInterval,
		frequency,
		isPaused: false,
		isRunning: false,
		maxDay: getMaxDay(),
		memory: {},
		orders: [],
		stepIndex: 0,
		numSteps: 0
	})

export const useBacktesting = (): UseBacktestingOutput => {
	const { formatMessage } = useIntl()

	const { flowViewGraph } = useContext(StrategyFlowContext)
	const { toast } = useContext(ToastContext)

	// TODO hasRequiredData could be removed
	let hasRequiredData = true
	if (!flowViewGraph) hasRequiredData = false

	const [state, dispatch] = useReducer<Reducer<State, Action>>(
		(state, action) => {
			info(action.type)

			if (
				[
					"PAUSE",
					"RESUME",
					"STOP",
					"START",
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
					isPaused: status === "paused",
					isRunning: status === "running"
				}
			}

			if (action.type === "UPDATED_RESULT") {
				const { numSteps, stepIndex } = action
				return {
					...state,
					numSteps,
					stepIndex
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
		initializer({
			frequency: defaultFrequency(),
			dayInterval: defaultDayInterval()
		})
	)

	// Dispatch action on every backtesting message received.
	useEffect(() => {
		backtesting.onmessage = ({
			data: action
		}: MessageEvent<BacktestingMessageOutData>) => {
			dispatch(action)
		}

		// Terminate backtesting worker on onmount.
		return () => {
			backtesting.terminate()
		}
	}, [dispatch])

	return { state, dispatch, hasRequiredData }
}
