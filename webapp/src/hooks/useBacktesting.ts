import { BinanceClient } from "_/binance/client"
import { StrategyContext } from "_/contexts/Strategy"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { useNodesCatalog } from "_/hooks/useNodesCatalog"
import { logging } from "_/logging"
import { Backtesting } from "@workspace/backtesting"
import {
	binanceKlineMaxLimit,
	BinanceKlinesCacheMap,
	getBinanceIntervalTime
} from "@workspace/binance"
import {
	DflowBinanceExecutor,
	dflowBinanceKlineIntervals,
	DflowCommonContext,
	extractBinanceFlowSymbolsAndIntervalsFromFlow
} from "@workspace/dflow"
import {
	BalanceChangeEvent,
	everyOneHour,
	Frequency,
	frequencyIntervalDuration,
	newOrder,
	Order
} from "@workspace/models"
import { FlowViewSerializableGraph } from "flow-view"
import {
	dateToTimestamp,
	Day,
	DayInterval,
	dayIntervalToDate,
	getDay,
	now,
	Timestamp,
	timestampToTime,
	yesterday
} from "minimal-time-helpers"
import { useCallback, useContext, useEffect, useReducer,useRef } from "react"

const { info } = logging("backtesting")

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
	info(action.type)

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
	const { strategy } = useContext(StrategyContext)

	const binanceSymbols = useBinanceSymbols()
	const nodesCatalog = useNodesCatalog()

	const backtestingRef = useRef<Backtesting>()

	let hasRequiredData = true
	if (!nodesCatalog) hasRequiredData = false
	if (!flowViewGraph) hasRequiredData = false
	if (strategy?.kind === "binance" && !binanceSymbols) hasRequiredData = false

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
		if (strategy?.kind === "binance") {
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
						const executor = new DflowBinanceExecutor(
							binance,
							binanceSymbols,
							nodesCatalog
						)
						await executor.run(
							{ params: {}, memory: {}, time: endTime },
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
		strategy,
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

		if (strategy?.kind === "binance") {
			try {
				if (!binanceSymbols) return
				const binance = new BinanceClient(
					{
						time: now()
					},
					klinesCache
				)
				const executor = new DflowBinanceExecutor(
					binance,
					binanceSymbols,
					nodesCatalog
				)
				const { balances, memory, orders, execution } =
					await executor.run(
						{ params: {}, memory: previousMemory, time },
						flowViewGraph
					)
				info("memory", JSON.stringify(memory, null, 2))
				info(
					"execution steps",
					JSON.stringify(
						execution?.steps.map(
							({ id, k, o }) =>
								`[${id}] ${k} ${o?.map(({ d }) =>
									typeof d === "string"
										? d
										: JSON.stringify(d)
								)}`
						),
						null,
						2
					)
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
		strategy,
		timestamps
	])

	useEffect(() => {
		if (isRunning) run()
	}, [isRunning, run])

	useEffect(() => {
		if (isPreparing) prepare()
	}, [isPreparing, prepare])

	useEffect(() => {
		if (backtestingRef.current) return
		if (!binanceSymbols) return
		if (!nodesCatalog) return
		const binance = new BinanceClient(
			{
				time: now()
			},
			klinesCache
		)
		const executor = new DflowBinanceExecutor(
			binance,
			binanceSymbols,
			nodesCatalog
		)
		const backtesting = new Backtesting({
			dayInterval: defaultDayInterval(),
			executor
		})
		backtestingRef.current = backtesting
	}, [backtestingRef, binanceSymbols, nodesCatalog])

	return { state, dispatch, hasRequiredData }
}

export type BacktestingOutput = ReturnType<typeof useBacktesting>
