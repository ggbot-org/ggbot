/// <reference no-default-lib="true"/>
/// <reference lib="ES2017" />
/// <reference lib="webworker" />

import {
	BacktestingBinanceClient,
	BacktestingMessageIn,
	BacktestingMessageOut,
	BacktestingSession
} from "@workspace/backtesting"
import {
	binanceKlineMaxLimit,
	BinanceKlinesCacheMap,
	getBinanceIntervalTime
} from "@workspace/binance"
import {
	DflowBinanceExecutor,
	DflowExecutorView,
	extractBinanceFlowSymbolsAndIntervalsFromFlow,
	getDflowBinanceNodesCatalog
} from "@workspace/dflow"
import { newOrder } from "@workspace/models"
import { FlowViewSerializableGraph } from "flow-view"

let binanceNodesCatalogShouldBeInitialized = false
const binanceClient = new BacktestingBinanceClient()
binanceClient.klinesCache = new BinanceKlinesCacheMap()
const binanceExecutor = new DflowBinanceExecutor()

// TODO try two backtests,  open two browser tabs on two different strategies or on the same strategy
// is this `session` shared?
const session = new BacktestingSession()

const statusChangedMessage = (
	session: BacktestingSession
): BacktestingMessageOut => ({
	type: "STATUS_CHANGED",
	status: session.status
})

const updatedResultMessage = (
	session: BacktestingSession
): BacktestingMessageOut => ({
	type: "UPDATED_RESULT",
	balanceHistory: session.balanceHistory,
	memory: session.memory,
	orders: session.orders
})

self.onmessage = async (event: MessageEvent<BacktestingMessageIn>) => {
	const message = event.data

	if (message.type === "START") {
		const { dayInterval, frequency, strategy } = message
		// Set session `strategy`.
		if (!strategy) return
		session.strategy = strategy
		const {
			strategyKey: { strategyKind }
		} = strategy
		// Set session `frequency` and `dayInterval`, then compute timestamps.
		if (!frequency || !dayInterval) return
		session.dayInterval = message.dayInterval
		session.frequency = message.frequency
		session.computeTimes()
		// Start session and notify UI.
		const statusChanged = session.start()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
		// Run backtesting according to given `strategyKind`.
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
					session.strategy.view as FlowViewSerializableGraph
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
					binanceClient.klines(symbol, interval, {
						limit: binanceKlineMaxLimit,
						endTime
					})
				}
			}
			// Pre-fetch klines for `tickerPrice()` by given `session.frequency` and `session.times`.
			// TODO

			while (session.status === "running") {
				// Run executor.
				const time = session.nextTime
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
					session.strategy.view as DflowExecutorView
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
	}

	if (message.type === "STOP") {
		const statusChanged = session.stop()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}

	if (message.type === "PAUSE") {
		// Update UI with latest results,
		self.postMessage(updatedResultMessage(session))
		// and notify changed status.
		const statusChanged = session.pause()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}

	if (message.type === "RESUME") {
		const statusChanged = session.resume()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}
}
