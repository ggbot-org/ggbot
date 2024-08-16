import { localWebStorage } from "_/storages/local"
import { workerScriptPath } from "_/workers"
import { BacktestingMessageInData, BacktestingMessageOutData, BacktestingSession } from "@workspace/backtesting"
import { logging } from "@workspace/logging"
import { everyOneHour, Frequency } from "@workspace/models"
import { Day, DayInterval, getDay, yesterday } from "minimal-time-helpers"
import { Dispatch, Reducer, useEffect, useReducer } from "react"

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

export type { State as UseBacktestingState }

const { info, warn } = logging("useBacktesting", localWebStorage.DEBUG_backtesting.get())

const backtesting = new Worker(`/${workerScriptPath.backtesting.join("/")}`)

function defaultDayInterval(): State["dayInterval"] {
	const maxDay = yesterday()
	return {
		start: getDay(maxDay).minus(7).days,
		end: maxDay
	}
}

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

export function useBacktesting(): {
	state: State
	dispatch: Dispatch<Action>
} {
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
		// Initial state.
		{
			frequency: everyOneHour(),
			dayInterval: defaultDayInterval(),
			afterStepBehaviour: BacktestingSession.defaultAfterStepBehaviour,
			maxDay: yesterday(),
			numSteps: 0,
			...partialInitialState
		}
	)

	// Dispatch action on every backtesting message received.
	useEffect(() => {
		backtesting.onmessage = ({ data: action }: MessageEvent<BacktestingMessageOutData>) => {
			dispatch(action)
		}

		backtesting.addEventListener("error", (error) => warn(error))
	}, [dispatch])

	return { dispatch, state }
}
