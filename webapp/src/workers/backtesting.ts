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
	DflowExecutorView,
	emptyFlow,
	extractBinanceFlowSymbolsAndIntervalsFromFlow,
	getDflowBinanceNodesCatalog
} from "@workspace/dflow"
import { newOrder } from "@workspace/models"
import { FlowViewSerializableGraph } from "flow-view"
import { Time } from "minimal-time-helpers"

let binanceNodesCatalogShouldBeInitialized = false
const binanceClient = new BacktestingBinanceClient()
binanceClient.klinesCache = new BinanceKlinesCacheMap()
const binanceExecutor = new DflowBinanceExecutor()

// TODO try two backtests,  open two browser tabs on two different strategies or on the same strategy
// is this `session` shared?
const session = new BacktestingSession()

const statusChangedMessage = (
	session: BacktestingSession
): BacktestingMessageOutData => ({
	type: "STATUS_CHANGED",
	status: session.status
})

const updatedResultMessage = (
	session: BacktestingSession
): BacktestingMessageOutData => ({
	type: "UPDATED_RESULT",
	balanceHistory: session.balanceHistory,
	memory: session.memory,
	orders: session.orders
})

self.onmessage = async ({
	data: message
}: MessageEvent<BacktestingMessageInData>) => {
	if (message.type === "SET_DAY_INTERVAL") {
		const { dayInterval } = message
		session.dayInterval = dayInterval
		self.postMessage({
			type: "UPDATED_DAY_INTERVAL",
			dayInterval
		} satisfies BacktestingMessageOutData)
		return
	}

	if (message.type === "SET_FREQUENCY") {
		const { frequency } = message
		session.frequency = frequency
		self.postMessage({
			type: "UPDATED_FREQUENCY",
			frequency
		} satisfies BacktestingMessageOutData)
		return
	}

	if (message.type === "SET_STRATEGY_KEY") {
		const { strategyKey } = message
		const strategy = new BacktestingStrategy({
			strategyKey,
			view: emptyFlow()
		})
		session.strategy = strategy
		return
	}

	if (message.type === "SET_STRATEGY_VIEW") {
		const { view } = message
		const { strategy } = session
		if (strategy) strategy.view = view
		return
	}

	if (message.type === "START") {
		// Start session (if possible) and notify UI.
		const statusChanged = session.start()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
		if (!session.canRun) return
		// Run backtesting according to given `strategyKind`.
		const { strategy } = session
		if (!strategy) return
		const {
			strategyKey: { strategyKind },
			view
		} = strategy
		const percentageStep = 5
		let completionPercentage = percentageStep
		if (strategyKind === "binance") {
			const { symbols: binanceSymbols } =
				await binanceClient.exchangeInfo()
			// Initialize `nodesCatalog`.
			if (binanceNodesCatalogShouldBeInitialized) {
				binanceExecutor.nodesCatalog =
					getDflowBinanceNodesCatalog(binanceSymbols)
				binanceNodesCatalogShouldBeInitialized = false
			}
			// TODO pre-fetch  could also get data from indexed db

			// Pre-fetch klines by extracted `symbolsAndIntervals` and given `session.times`.
			// TODO
			//
			// binanceClient.klinesCache?.setKline(symbol,)
			//
			const symbolsAndIntervals =
				extractBinanceFlowSymbolsAndIntervalsFromFlow(
					binanceSymbols,
					// TODO should not use a cast,
					view as FlowViewSerializableGraph
				)

			const firstTime = session.times[0]
			const lastTime = session.times[session.times.length - 1]
			for (const { interval, symbol } of symbolsAndIntervals) {
				const startTime = firstTime
				while (startTime < lastTime) {
					const endTime = Math.min(
						lastTime,
						getBinanceIntervalTime[interval](startTime).plus(
							binanceKlineMaxLimit
						)
					)
					await binanceClient.klines(symbol, interval, {
						limit: binanceKlineMaxLimit,
						endTime
					})
				}
			}
			// Pre-fetch klines for `tickerPrice()` by given `session.frequency` and `session.times`.
			// TODO

			let time: Time | undefined
			while ((time = session.nextTime)) {
				// Run executor.
				binanceClient.time = time
				const { balances, memory, orders } = await binanceExecutor.run(
					{
						binance: binanceClient,
						params: {},
						memory: session.memory,
						time
					},
					// TODO should not use a cast,
					// also DflowExecutorView is not a nice name
					view as DflowExecutorView
				)
				if (balances.length > 0)
					session.balanceHistory.push({
						balances,
						whenCreated: time
					})
				session.memory = memory
				session.orders.push(
					...orders.map(({ info }) => newOrder({ info }))
				)

				// Update UI with current results on every `percentageStep`.
				if (session.completionPercentage > completionPercentage) {
					completionPercentage =
						session.completionPercentage + percentageStep
					self.postMessage(updatedResultMessage(session))
				}
			}
		}
		// End session and notify UI.
		if (session.status === "done")
			self.postMessage({ type: "STATUS_CHANGED", status: "done" })
		return
	}

	if (message.type === "STOP") {
		const statusChanged = session.stop()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
		return
	}

	if (message.type === "PAUSE") {
		// Update UI with latest results,
		self.postMessage(updatedResultMessage(session))
		// and notify changed status.
		const statusChanged = session.pause()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
		return
	}

	if (message.type === "RESUME") {
		const statusChanged = session.resume()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
		return
	}
}
