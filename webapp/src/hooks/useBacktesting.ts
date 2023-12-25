import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { logging } from "_/logging"
import {
	BacktestingMessageInData,
	BacktestingMessageOutData,
	BacktestingSession
} from "@workspace/backtesting"
import { everyOneHour, Frequency } from "@workspace/models"
import { Day, DayInterval, getDay, yesterday } from "minimal-time-helpers"
import { Dispatch, Reducer, useContext, useEffect, useReducer } from "react"

import { ecmaScriptPath } from "../ecmaScripts"

type Action =
	| BacktestingMessageInData
	| BacktestingMessageOutData
	| {
			type: "INITALIZED"
	  }

type State = Pick<
	BacktestingSession,
	"currentTimestamp" | "memory" | "orders" | "stepIndex"
> & {
	dayInterval: DayInterval
	frequency: Frequency
	isPaused: boolean
	isDone: boolean
	isRunning: boolean
	maxDay: Day
	numSteps: number
}

export type UseBacktestingOutput = {
	state: State
	dispatch: Dispatch<Action>
	hasFlow: boolean
}

const { info } = logging("useBacktesting")

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
	currentTimestamp: undefined,
	dayInterval,
	frequency,
	isPaused: false,
	isDone: false,
	isRunning: false,
	maxDay: getMaxDay(),
	memory: {},
	orders: [],
	stepIndex: 0,
	numSteps: 0
})

export const useBacktesting = (): UseBacktestingOutput => {
	const { flowViewGraph } = useContext(StrategyFlowContext)

	const hasFlow = Boolean(flowViewGraph)

	const [state, dispatch] = useReducer<Reducer<State, Action>>(
		(state, action) => {
			const { type: actionType } = action
			if (
				[
					"PAUSE",
					"RESUME",
					"STOP",
					"START",
					"SET_DAY_INTERVAL",
					"SET_FREQUENCY"
				].includes(actionType)
			) {
				info(actionType)
				backtesting.postMessage(action)
				return state
			}

			if (actionType === "STATUS_CHANGED") {
				const { status } = action
				info(actionType, status)
				return {
					...state,
					isDone: status === "done",
					isPaused: status === "paused",
					isRunning: status === "running"
				}
			}

			if (actionType === "UPDATED_MEMORY") {
				const { memory } = action
				info(actionType, memory)
				return {
					...state,
					memory
				}
			}

			if (actionType === "UPDATED_PROGRESS") {
				const { currentTimestamp, numSteps, stepIndex } = action
				info(actionType, { numSteps, stepIndex })
				return {
					...state,
					currentTimestamp,
					numSteps,
					stepIndex
				}
			}

			if (actionType === "UPDATED_ORDERS") {
				const { orders } = action
				info(actionType, orders)
				return {
					...state,
					orders: state.orders.concat(orders)
				}
			}

			if (actionType === "UPDATED_DAY_INTERVAL") {
				info(actionType)
				return {
					...state,
					dayInterval: action.dayInterval
				}
			}

			if (actionType === "UPDATED_FREQUENCY") {
				info(actionType)
				return {
					...state,
					frequency: action.frequency
				}
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

	return { hasFlow, dispatch, state }
}
