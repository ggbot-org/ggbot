import {
	BacktestingBinanceClient,
	BacktestingMessageInData,
	BacktestingMessageOutData,
	BacktestingSession,
	BacktestingStrategy
} from "@workspace/backtesting"
import {
	binanceKlineMaxLimit,
	getBinanceIntervalTime
} from "@workspace/binance"
import {
	BinanceExchangeInfoCacheIDB,
	BinanceKlinesCacheIDB,
	BinanceIDB
} from "@workspace/binance-indexeddb"
import {
	DflowBinanceExecutor,
	extractBinanceSymbolsAndIntervalsFromFlowCandles,
	extractsBinanceSymbolsFromTickerPriceAndOrderNodes,
	getDflowBinanceNodesCatalog
} from "@workspace/dflow"
import { logging } from "@workspace/logging"
import { newId, Order, StrategyKind } from "@workspace/models"
import { Time } from "minimal-time-helpers"

type HandleStrategyKind = Record<StrategyKind, () => Promise<void>>

const { debug, warn } = logging("backtesting")

const binanceExecutor = new DflowBinanceExecutor()
const binanceIDB = new BinanceIDB()
const binanceExchangeInfoCache = new BinanceExchangeInfoCacheIDB(binanceIDB)
const binanceKlinesCache = new BinanceKlinesCacheIDB(binanceIDB)

const session = new BacktestingSession()

let memoryChangedOnSomeStep = false
const orderSet = new Set<Order>()
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

const updateUI = (session: BacktestingSession) => {
	// Check if session should be stopped before handling memory or orders.
	if (
		(memoryChangedOnSomeStep &&
			session.afterStepBehaviour.pauseOnMemoryChange) ||
		(orderSet.size > 0 && session.afterStepBehaviour.pauseOnNewOrder)
	) {
		const statusChanged = session.pause()
		if (statusChanged) POST(statusChangedMessage(session))
	}
	// Update progress.
	POST(updatedProgressMessage(session))
	// Update memory.
	if (memoryChangedOnSomeStep) {
		POST({
			type: "UPDATED_MEMORY",
			memory: session.memory
		})
		memoryChangedOnSomeStep = false
	}
	// Update orders.
	if (orderSet.size > 0) {
		const orders = Array.from(orderSet.values())
		POST({
			type: "UPDATED_ORDERS",
			orders
		})
		orderSet.clear()
	}
}

/** Get strategy flow from session or throw. */
const getStrategyFlow = (): BacktestingStrategy["flow"] => {
	const flow = session.strategy?.flow
	if (!flow) {
		const error = new ErrorMissingFlow()
		warn(error)
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
	// Initialize `shouldUpdateUI` to true, so first iteration will update UI.
	let shouldUpdateUI = true
	let nextUpdateTime = Date.now() + updateInterval
	memoryChangedOnSomeStep = false

	while ((time = session.nextTime)) {
		binance.time = time
		// Run executor.
		try {
			const { memory, memoryChanged, orders } = await binanceExecutor.run(
				{
					binance,
					params: {},
					memory: session.memory,
					time
				},
				flow
			)
			if (memoryChanged) {
				memoryChangedOnSomeStep = true
				session.memory = memory
				if (session.afterStepBehaviour.pauseOnMemoryChange)
					shouldUpdateUI = true
			}
			if (orders.length) {
				if (session.afterStepBehaviour.pauseOnNewOrder)
					shouldUpdateUI = true
				for (const { info } of orders) {
					const order = {
						id: newId(),
						info,
						whenCreated: time
					} satisfies Order
					orderSet.add(order)
					session.orders.push(order)
				}
			}
		} catch (error) {
			debug(error)
			const statusChanged = session.stop()
			if (statusChanged) POST(statusChangedMessage(session))
		}

		if (Date.now() > nextUpdateTime) {
			nextUpdateTime = Date.now() + updateInterval
			shouldUpdateUI = true
		}

		if (shouldUpdateUI) {
			shouldUpdateUI = false
			updateUI(session)
		}
	}
}

self.onmessage = async ({
	data: message
}: MessageEvent<BacktestingMessageInData>) => {
	const { type: messageType } = message

	if (messageType === "SET_AFTER_STEP_BEHAVIOUR") {
		const { afterStepBehaviour } = message
		session.afterStepBehaviour = afterStepBehaviour
	}

	if (messageType === "SET_DAY_INTERVAL") {
		const { dayInterval } = message
		session.dayInterval = dayInterval
	}

	if (messageType === "SET_FREQUENCY") {
		const { frequency } = message
		session.frequency = frequency
	}

	if (messageType === "START") {
		const { dayInterval, flow, frequency, strategyKey, strategyName } =
			message
		const { interval: schedulingInterval } = frequency
		// Initialize session.
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

		// Reset conditions.
		orderSet.clear()
		memoryChangedOnSomeStep = false

		// Run backtesting according to given `strategyKind`.

		const { strategyKind } = strategyKey

		const handleStrategyKind: HandleStrategyKind = {
			binance: async () => {
				const binance = getBinance(schedulingInterval)
				await prepareBinance(binance, schedulingInterval)
				await runBinance(binance)
			},
			none: () => Promise.resolve()
		}

		await handleStrategyKind[strategyKind]()

		if (session.status === "done") {
			updateUI(session)
			POST(statusChangedMessage(session))
		}
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
		const strategyKind = session.strategy?.strategyKey.strategyKind
		if (!strategyKind) return
		const schedulingInterval = session.frequency?.interval
		if (!schedulingInterval) return
		const statusChanged = session.resume()
		if (statusChanged) POST(statusChangedMessage(session))

		const handleStrategyKind: HandleStrategyKind = {
			binance: async () => {
				const binance = getBinance(schedulingInterval)
				await prepareBinance(binance, schedulingInterval)
				await runBinance(binance)
			},
			none: () => Promise.resolve()
		}

		await handleStrategyKind[strategyKind]()

		if (session.status === "done") {
			updateUI(session)
			POST(statusChangedMessage(session))
		}
	}
}
