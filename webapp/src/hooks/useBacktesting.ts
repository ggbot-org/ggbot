import {
	binanceKlineMaxLimit,
	BinanceKlinesCacheMap,
	getBinanceIntervalTime
} from "@ggbot2/binance"
import {
	BinanceDflowExecutor,
	dflowBinanceKlineIntervals,
	DflowCommonContext,
	extractBinanceFlowSymbolsAndIntervalsFromFlow
} from "@ggbot2/dflow"
import {
	BalanceChangeEvent,
	everyOneHour,
	Frequency,
	frequencyIntervalDuration,
	newOrder,
	Order
} from "@ggbot2/models"
import { FlowViewSerializableGraph } from "flow-view"
import {
	dateToTimestamp,
	Day,
	DayInterval,
	dayIntervalToDate,
	getDay,
	Timestamp,
	timestampToTime,
	yesterday
} from "minimal-time-helpers"
import { useCallback, useContext, useEffect, useReducer } from "react"

import { BinanceClient } from "../binance/client.js"
import { StrategyContext } from "../contexts/Strategy.js"
import { useBinanceSymbols } from "../hooks/useBinanceSymbols.js"
import { useNodesCatalog } from "../hooks/useNodesCatalog.js"

type State = Pick<DflowCommonContext, "memory"> & {
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
			type: "END"
	  }
	| {
			type: "NEXT"
			data: {
				balanceChangeEvent?: BalanceChangeEvent
				orders: Order[]
			} & Pick<State, "memory">
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

const klinesCache = new BinanceKlinesCacheMap()

const isReadOnlyState = (
	state: Pick<State, "isRunning" | "isPaused" | "isPreparing">
) => {
	if (state.isRunning || state.isPaused || state.isPreparing) return true
	return false
}

const backtestingReducer = (state: State, action: Action) => {
	switch (action.type) {
		case "END": {
			return {
				...state,
				isPaused: false,
				isRunning: false
			}
		}

		case "NEXT": {
			if (!state.isRunning) return state
			const { balanceChangeEvent, memory, orders } = action.data
			const stepIndex = state.stepIndex + 1
			const currentTimestamp = state.timestamps[stepIndex]
			return {
				...state,
				balanceHistory: balanceChangeEvent
					? state.balanceHistory.concat(balanceChangeEvent)
					: state.balanceHistory,
				currentTimestamp,
				memory: memory,
				orders: state.orders.concat(orders),
				stepIndex
			}
		}

		case "PAUSE": {
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
			if (isReadOnlyState(state)) return { ...state, isReadOnly: true }
			const { frequency } = action.data
			return getInitialState({
				frequency,
				dayInterval: state.dayInterval
			})
		}

		case "SET_DAY_INTERVAL": {
			if (isReadOnlyState(state)) return { ...state, isReadOnly: true }
			const { dayInterval } = action.data
			return getInitialState({
				frequency: state.frequency,
				dayInterval
			})
		}

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
			return {
				...state,
				isPreparing: false,
				isRunning: true
			}
		}

		case "STOP": {
			return getInitialState({
				frequency: state.frequency,
				dayInterval: state.dayInterval
			})
		}

		default:
			return state
	}
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

export const useBacktesting = (
	flowViewGraph: FlowViewSerializableGraph | undefined
) => {
	const {
		strategy: { kind: strategyKind }
	} = useContext(StrategyContext)

	const binanceSymbols = useBinanceSymbols()
	const nodesCatalog = useNodesCatalog()

	let hasRequiredData = true
	if (!nodesCatalog) hasRequiredData = false
	if (!flowViewGraph) hasRequiredData = false
	if (strategyKind === "binance" && !binanceSymbols) hasRequiredData = false

	const [state, dispatch] = useReducer(
		backtestingReducer,
		getInitialState({
			frequency: defaultFrequency(),
			dayInterval: defaultDayInterval()
		})
	)

	const {
		currentTimestamp,
		isRunning,
		isPreparing,
		memory: previousMemory,
		stepIndex,
		timestamps
	} = state

	const prepare = useCallback(async () => {
		if (!nodesCatalog) return
		if (!flowViewGraph) return
		if (strategyKind === "binance") {
			try {
				// Run flow to cache market data.
				if (!binanceSymbols) return
				const symbolsAndIntervals =
					extractBinanceFlowSymbolsAndIntervalsFromFlow(
						binanceSymbols,
						flowViewGraph
					)
						.sort(
							// Prices are cached with lower interval first.
							(a, b) =>
								dflowBinanceKlineIntervals.indexOf(a.interval) -
								dflowBinanceKlineIntervals.indexOf(b.interval)
						)
						.filter((element, elementIndex, elements) => {
							for (
								let index = 0;
								index <= elementIndex;
								elementIndex++
							) {
								if (
									element.interval ===
										elements[index].interval &&
									element.symbol === elements[index].symbol
								)
									return index === elementIndex
							}
						})

				const firstTime = timestampToTime(timestamps[0])
				const lastTime = timestampToTime(
					timestamps[timestamps.length - 1]
				)

				for (const { interval, symbol } of symbolsAndIntervals) {
					let startTime = firstTime
					while (startTime < lastTime) {
						const endTime = Math.min(
							lastTime,
							getBinanceIntervalTime[interval](startTime).plus(
								binanceKlineMaxLimit
							)
						)
						const binance = new BinanceClient(
							{
								balances: [],
								time: endTime
							},
							klinesCache,
							{
								interval,
								symbol,
								klinesParameters: {
									limit: binanceKlineMaxLimit,
									endTime
								}
							}
						)
						const executor = new BinanceDflowExecutor(
							binance,
							binanceSymbols,
							nodesCatalog
						)
						await executor.run(
							{ input: {}, memory: {}, time: endTime },
							flowViewGraph
						)
						startTime = endTime
					}
				}
				// Once market data is cached, backtesting can start.
				dispatch({ type: "START" })
			} catch (error) {
				// TODO show some feedback with a toast
				console.error(error)
			}
		} else {
			dispatch({ type: "START" })
		}
	}, [
		dispatch,
		flowViewGraph,
		strategyKind,
		timestamps,
		binanceSymbols,
		nodesCatalog
	])

	const run = useCallback(async () => {
		if (!nodesCatalog) return
		if (!flowViewGraph) return
		if (timestamps.length === stepIndex) {
			dispatch({ type: "END" })
			return
		}
		if (!currentTimestamp) return
		const time = timestampToTime(currentTimestamp)

		if (strategyKind === "binance") {
			try {
				if (!binanceSymbols) return
				const binance = new BinanceClient(
					{
						balances: [],
						time
					},
					klinesCache
				)
				const executor = new BinanceDflowExecutor(
					binance,
					binanceSymbols,
					nodesCatalog
				)
				const { balances, memory, orders } = await executor.run(
					{ input: {}, memory: previousMemory, time },
					flowViewGraph
				)
				const balanceChangeEvent =
					balances.length === 0
						? undefined
						: {
								balances,
								whenCreated: time
						  }
				dispatch({
					type: "NEXT",
					data: {
						balanceChangeEvent,
						memory,
						orders: orders.map(({ info }) => newOrder({ info }))
					}
				})
			} catch (error) {
				// TODO show some feedback with a toast
				console.error(error)
				dispatch({ type: "END" })
			}
		}
	}, [
		binanceSymbols,
		currentTimestamp,
		dispatch,
		flowViewGraph,
		nodesCatalog,
		previousMemory,
		stepIndex,
		strategyKind,
		timestamps
	])

	useEffect(() => {
		if (isRunning) run()
	}, [isRunning, run])

	useEffect(() => {
		if (isPreparing) prepare()
	}, [isPreparing, prepare])

	return { state, dispatch, hasRequiredData }
}

export type BacktestingOutput = ReturnType<typeof useBacktesting>