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
	| "afterStepBehaviour"
	| "currentTimestamp"
	| "memory"
	| "orders"
	| "stepIndex"
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

const partialInitialState: Pick<
	State,
	| "currentTimestamp"
	| "isPaused"
	| "isDone"
	| "isRunning"
	| "memory"
	| "orders"
	| "stepIndex"
> = {
	currentTimestamp: undefined,
	isPaused: false,
	isDone: false,
	isRunning: false,
	memory: {},
	orders: [],
	stepIndex: 0
}

const initializer = ({
	frequency,
	dayInterval
}: Pick<State, "frequency" | "dayInterval">): State => ({
	afterStepBehaviour: BacktestingSession.defaultAfterStepBehaviour,
	dayInterval,
	frequency,
	maxDay: getMaxDay(),
	numSteps: 0,
	...partialInitialState
})

export const useBacktesting = (): UseBacktestingOutput => {
	const { flowViewGraph } = useContext(StrategyFlowContext)

	const hasFlow = Boolean(flowViewGraph)

	const [state, dispatch] = useReducer<Reducer<State, Action>>(
		(state, action) => {
			const { type: actionType } = action
			if (["STOP", "START"].includes(actionType)) {
				info(actionType)
				backtesting.postMessage(action)
				return {
					...state,
					...partialInitialState
				}
			}

			if (["PAUSE", "RESUME"].includes(actionType)) {
				info(actionType)
				backtesting.postMessage(action)
				return state
			}

			if (actionType === "SET_AFTER_STEP_BEHAVIOUR") {
				const { afterStepBehaviour } = action
				info(actionType, afterStepBehaviour)
				backtesting.postMessage(action)
				return {
					...state,
					afterStepBehaviour
				}
			}

			if (actionType === "SET_DAY_INTERVAL") {
				const { dayInterval } = action
				info(actionType, dayInterval)
				backtesting.postMessage(action)
				return {
					...state,
					dayInterval
				}
			}

			if (actionType === "SET_FREQUENCY") {
				const { frequency } = action
				info(actionType, frequency)
				backtesting.postMessage(action)
				return {
					...state,
					frequency
				}
			}

			if (actionType === "STATUS_CHANGED") {
				const { status } = action
				info(actionType, status)
				return {
					...state,
					isDone: status === "done",
					isPaused: status === "paused",
					isRunning: status === "running",
					...(status === "initial" ? partialInitialState : {})
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
