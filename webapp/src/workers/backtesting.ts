/// <reference no-default-lib="true"/>
/// <reference lib="ES2017" />
/// <reference lib="webworker" />

import {
	BacktestingBinanceClient,
	BacktestingMessageInData,
	BacktestingMessageOutData,
	BacktestingSession,
	BacktestingStrategy
} from "@workspace/backtesting"
import {
	binanceKlineMaxLimit,
	BinanceKlinesCacheMap,
	getBinanceIntervalTime
} from "@workspace/binance"
import {
	DflowBinanceExecutor,
	extractBinanceSymbolsAndIntervalsFromFlowCandles,
	extractsBinanceSymbolsFromTickerPriceAndOrderNodes,
	getDflowBinanceNodesCatalog
} from "@workspace/dflow"
import { newId, Order } from "@workspace/models"
import { Time } from "minimal-time-helpers"

import { BinanceExchangeInfoCache } from "../binance/exchangeInfoCache"
import { logging } from "../logging"

const { warn } = logging("backtesting")

const binanceExecutor = new DflowBinanceExecutor()
const binanceExchangeInfoCache = new BinanceExchangeInfoCache()
const binanceKlinesCache = new BinanceKlinesCacheMap()

const session = new BacktestingSession()

const percentageStep = 5
const updateInterval = 1000

const statusChangedMessage = (
	session: BacktestingSession
): BacktestingMessageOutData => ({
	type: "STATUS_CHANGED",
	status: session.status
})

const updatedProgressMessage = (
	session: BacktestingSession
): BacktestingMessageOutData => ({
	type: "UPDATED_PROGRESS",
	currentTimestamp: session.currentTimestamp,
	stepIndex: session.stepIndex,
	numSteps: session.numSteps
})

const POST = (message: BacktestingMessageOutData) => {
	self.postMessage(message)
}

class ErrorMissingFlow extends Error {
	static message = "Cannot run executor without a strategy flow"
	constructor() {
		super(ErrorMissingFlow.message)
	}
}

const ifSessionIsDoneNotifyUI = (session: BacktestingSession) => {
	if (session.status !== "done") return
	POST(updatedProgressMessage(session))
	POST(statusChangedMessage(session))
}

/** Get strategy flow from session or throw. */
const getStrategyFlow = (): BacktestingStrategy["flow"] => {
	const flow = session.strategy?.flow
	if (!flow) {
		const error = new ErrorMissingFlow()
		warn(error.message)
		throw error
	}
	return flow
}

const prepareBinance = async (
	binance: BacktestingBinanceClient,
	schedulingInterval: BacktestingBinanceClient["schedulingInterval"]
) => {
	const flow = getStrategyFlow()
	const { symbols: binanceSymbols } = await binance.exchangeInfo()
	binanceExecutor.nodesCatalog = getDflowBinanceNodesCatalog(binanceSymbols)

	const firstTime = session.times[0]
	const lastTime = session.times[session.times.length - 1]

	// Pre-fetch klines for "candles" nodes.

	const symbolsAndIntervalsFromCandlesNodes =
		extractBinanceSymbolsAndIntervalsFromFlowCandles(binanceSymbols, flow)

	for (const { interval, symbol } of symbolsAndIntervalsFromCandlesNodes) {
		let startTime = firstTime
		while (startTime < lastTime) {
			const endTime = Math.min(
				lastTime,
				getBinanceIntervalTime[interval](startTime).plus(
					binanceKlineMaxLimit
				)
			)
			await binance.klines(symbol, interval, {
				startTime,
				endTime
			})
			startTime = endTime
		}
	}

	// Pre-fetch klines for "price" nodes.

	const symbolsFromNodes = extractsBinanceSymbolsFromTickerPriceAndOrderNodes(
		binanceSymbols,
		flow
	)

	for (const symbol of symbolsFromNodes) {
		let startTime = firstTime
		while (startTime < lastTime) {
			const endTime = Math.min(
				lastTime,
				getBinanceIntervalTime[schedulingInterval](startTime).plus(
					binanceKlineMaxLimit
				)
			)
			await binance.klines(symbol, schedulingInterval, {
				startTime,
				endTime
			})
			startTime = endTime
		}
	}
}

const getBinance = (
	schedulingInterval: BacktestingBinanceClient["schedulingInterval"]
) => {
	const binance = new BacktestingBinanceClient(schedulingInterval)
	binance.publicClient.exchangeInfoCache = binanceExchangeInfoCache
	binance.publicClient.klinesCache = binanceKlinesCache
	return binance
}

const runBinance = async (binance: BacktestingBinanceClient) => {
	const flow = getStrategyFlow()
	let time: Time | undefined
	let nextUpdateTime = Date.now() + updateInterval
	let nextCompletionPercentage = session.completionPercentage + percentageStep
	const orderSet = new Set<Order>()

	while ((time = session.nextTime)) {
		binance.time = time
		// Run executor.
		try {
			const { memory, orders } = await binanceExecutor.run(
				{
					binance,
					params: {},
					memory: session.memory,
					time
				},
				flow
			)
			session.memory = memory
			for (const { info } of orders) {
				const order = {
					id: newId(),
					info,
					whenCreated: time
				} satisfies Order
				orderSet.add(order)
				session.orders.push(order)
			}
		} catch (error) {
			warn(error)
			const statusChanged = session.stop()
			if (statusChanged) POST(statusChangedMessage(session))
		}

		// Update UI with current progress on every `percentageStep`.
		if (session.completionPercentage > nextCompletionPercentage) {
			nextCompletionPercentage =
				session.completionPercentage + percentageStep
			POST(updatedProgressMessage(session))
		}

		if (Date.now() > nextUpdateTime) {
			nextUpdateTime = Date.now() + updateInterval
			POST({
				type: "UPDATED_MEMORY",
				memory: session.memory
			})
			if (orderSet.size > 0) {
				const orders = Array.from(orderSet.values())
				POST({
					type: "UPDATED_ORDERS",
					orders
				})
				orderSet.clear()
			}
		}
	}
}

self.onmessage = async ({
	data: message
}: MessageEvent<BacktestingMessageInData>) => {
	const { type: messageType } = message
	if (messageType === "SET_DAY_INTERVAL") {
		const { dayInterval } = message
		session.dayInterval = dayInterval
		return POST({
			type: "UPDATED_DAY_INTERVAL",
			dayInterval: session.dayInterval
		})
	}

	if (messageType === "SET_FREQUENCY") {
		const { frequency } = message
		session.frequency = frequency
		return POST({
			type: "UPDATED_FREQUENCY",
			frequency: session.frequency
		} satisfies BacktestingMessageOutData)
	}

	if (messageType === "START") {
		const { dayInterval, flow, frequency, strategyKey, strategyName } =
			message
		const { interval: schedulingInterval } = frequency
		session.dayInterval = dayInterval
		session.frequency = frequency
		session.computeTimes()
		const strategy = new BacktestingStrategy({
			strategyKey,
			strategyName,
			flow
		})
		session.strategy = strategy
		session.computeTimes()

		// Start session (if possible) and notify UI.
		const statusChanged = session.start()
		if (statusChanged) POST(statusChangedMessage(session))
		if (!session.canRun) return

		// Run backtesting according to given `strategyKind`.
		const { strategyKind } = strategyKey

		if (strategyKind === "binance") {
			const binance = getBinance(schedulingInterval)
			await prepareBinance(binance, schedulingInterval)
			await runBinance(binance)
		}

		ifSessionIsDoneNotifyUI(session)
	}

	if (messageType === "STOP") {
		const statusChanged = session.stop()
		if (statusChanged) POST(statusChangedMessage(session))
		POST(updatedProgressMessage(session))
	}

	if (messageType === "PAUSE") {
		const statusChanged = session.pause()
		if (statusChanged) POST(statusChangedMessage(session))
		POST(updatedProgressMessage(session))
	}

	if (messageType === "RESUME") {
		const statusChanged = session.resume()
		if (statusChanged) POST(statusChangedMessage(session))
		const strategyKind = session.strategy?.strategyKey.strategyKind
		const schedulingInterval = session.frequency?.interval
		if (!schedulingInterval) return

		if (strategyKind === "binance") {
			const binance = getBinance(schedulingInterval)
			await prepareBinance(binance, schedulingInterval)
			await runBinance(binance)
		}

		ifSessionIsDoneNotifyUI(session)
	}
}
