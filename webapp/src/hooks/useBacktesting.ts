import { workerScriptPath } from '_/workers'
import { BacktestingMessageInData, BacktestingMessageOutData, BacktestingSession } from '@workspace/backtesting'
import { everyOneHour, Frequency } from '@workspace/models'
import { Day, DayInterval, getDay, yesterday } from 'minimal-time-helpers'
import { Dispatch, useEffect, useReducer } from 'react'

type Action =
	| BacktestingMessageInData
	| BacktestingMessageOutData
	| {
		type: 'INITALIZED'
	}

type State = Pick<
	BacktestingSession,
	| 'afterStepBehaviour'
	| 'currentTimestamp'
	| 'memory'
	| 'orders'
	| 'stepIndex'
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

const backtesting = new Worker(`/${workerScriptPath.backtesting.join('/')}`)

function defaultDayInterval(): State['dayInterval'] {
	const maxDay = yesterday()
	return {
		start: getDay(maxDay).minus(7).days,
		end: maxDay
	}
}

const partialInitialState: Pick<
	State,
	| 'currentTimestamp'
	| 'isPaused'
	| 'isDone'
	| 'isRunning'
	| 'memory'
	| 'orders'
	| 'stepIndex'
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
	const [state, dispatch] = useReducer(
		(state, action) => {
			if (['STOP', 'START'].includes(action.type)) {
				backtesting.postMessage(action)
				return {
					...state,
					...partialInitialState
				}
			}

			if (['PAUSE', 'RESUME'].includes(action.type)) {
				backtesting.postMessage(action)
				return state
			}

			if (action.type === 'SET_AFTER_STEP_BEHAVIOUR') {
				const { afterStepBehaviour } = action
				backtesting.postMessage(action)
				return {
					...state,
					afterStepBehaviour
				}
			}

			if (action.type === 'SET_DAY_INTERVAL') {
				const { dayInterval } = action
				backtesting.postMessage(action)
				return {
					...state,
					dayInterval
				}
			}

			if (action.type === 'SET_FREQUENCY') {
				const { frequency } = action
				backtesting.postMessage(action)
				return {
					...state,
					frequency
				}
			}

			if (action.type === 'STATUS_CHANGED') {
				const { status } = action
				return {
					...state,
					isDone: status === 'done',
					isPaused: status === 'paused',
					isRunning: status === 'running',
					...(status === 'initial' ? partialInitialState : {})
				}
			}

			if (action.type === 'UPDATED_MEMORY') {
				const { memory } = action
				return {
					...state,
					memory
				}
			}

			if (action.type === 'UPDATED_PROGRESS') {
				const { currentTimestamp, numSteps, stepIndex } = action
				return {
					...state,
					currentTimestamp,
					numSteps,
					stepIndex
				}
			}

			if (action.type === 'UPDATED_ORDERS') {
				const { orders } = action
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
		backtesting.onmessage = (
			{ data: action }: MessageEvent<BacktestingMessageOutData>
		) => {
			dispatch(action)
		}
		backtesting.addEventListener('error', (error) => console.error(error))
	}, [dispatch])

	return { dispatch, state }
}
