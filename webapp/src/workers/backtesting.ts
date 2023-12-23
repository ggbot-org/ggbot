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
	// DflowExecutorView,
	extractBinanceFlowSymbolsAndIntervalsFromFlow,
	getDflowBinanceNodesCatalog
} from "@workspace/dflow"
// import { newOrder } from "@workspace/models"
import { Time } from "minimal-time-helpers"

import { BinanceExchangeInfoCache } from "../binance/exchangeInfoCache"
import { logging } from "../logging"

const { warn } = logging("backtesting")

let binanceNodesCatalogShouldBeInitialized = false
const binance = new BacktestingBinanceClient()
binance.klinesCache = new BinanceKlinesCacheMap()
binance.exchangeInfoCache = new BinanceExchangeInfoCache()
const binanceExecutor = new DflowBinanceExecutor()

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
	orders: session.orders,
	status: session.status,
	stepIndex: session.stepIndex,
	numSteps: session.numSteps
})

self.onmessage = async ({
	data: message
}: MessageEvent<BacktestingMessageInData>) => {
	if (message.type === "SET_DAY_INTERVAL") {
		const { dayInterval } = message
		// TODO remove this block
		// session.dayInterval = dayInterval
		self.postMessage({
			type: "UPDATED_DAY_INTERVAL",
			dayInterval
		} satisfies BacktestingMessageOutData)
		return
	}

	if (message.type === "SET_FREQUENCY") {
		const { frequency } = message
		// TODO remove this block
		// session.frequency = frequency
		self.postMessage({
			type: "UPDATED_FREQUENCY",
			frequency
		} satisfies BacktestingMessageOutData)
		return
	}

	if (message.type === "START") {
		const { strategyKey, view, dayInterval, frequency } = message
		session.dayInterval = dayInterval
		session.frequency = frequency
		session.computeTimes()
		const strategy = new BacktestingStrategy({
			strategyKey,
			view
		})
		session.strategy = strategy
		session.computeTimes()
		// Start session (if possible) and notify UI.
		const statusChanged = session.start()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
		if (!session.canRun) return
		// Run backtesting according to given `strategyKind`.
		const { strategyKind } = strategyKey
		const percentageStep = 5
		let completionPercentage = percentageStep
		if (strategyKind === "binance") {
			const { symbols: binanceSymbols } = await binance.exchangeInfo()
			// Initialize `nodesCatalog`.
			if (binanceNodesCatalogShouldBeInitialized) {
				binanceExecutor.nodesCatalog =
					getDflowBinanceNodesCatalog(binanceSymbols)
				binanceNodesCatalogShouldBeInitialized = false
			}

			// Pre-fetch klines by extracted `symbolsAndIntervals` and given `session.times`.

			const symbolsAndIntervals =
				extractBinanceFlowSymbolsAndIntervalsFromFlow(
					binanceSymbols,
					view
				)

			const firstTime = session.times[0]
			const lastTime = session.times[session.times.length - 1]
			for (const { interval /*, symbol */ } of symbolsAndIntervals) {
				let startTime = firstTime
				while (startTime < lastTime) {
					const endTime = Math.min(
						lastTime,
						getBinanceIntervalTime[interval](startTime).plus(
							binanceKlineMaxLimit
						)
					)
					startTime = endTime
					// 		await binance.klines(symbol, interval, {
					// 			limit: binanceKlineMaxLimit,
					// 			endTime
					// 		})
				}
			}

			// Pre-fetch klines for `tickerPrice()` by given `session.frequency` and `session.times`.
			// TODO

			// TODO pre-fetch  could also get data from indexed db
			//
			let time: Time | undefined
			while ((time = session.nextTime)) {
				// Run executor.
				binance.time = time
				try {
					// const { balances, memory, orders } =
					// 	await binanceExecutor.run(
					// 		{
					// 			binance,
					// 			params: {},
					// 			memory: session.memory,
					// 			time
					// 		},
					// 		// TODO should not use a cast,
					// 		// also DflowExecutorView is not a nice name
					// 		view as DflowExecutorView
					// 	)
					// if (balances.length > 0)
					// 	session.balanceHistory.push({
					// 		balances,
					// 		whenCreated: time
					// 	})
					// session.memory = memory
					// session.orders.push(
					// 	...orders.map(({ info }) => newOrder({ info }))
					// )
				} catch (error) {
					warn(error)
					const statusChanged = session.stop()
					if (statusChanged)
						self.postMessage(statusChangedMessage(session))
				}

				// Update UI with current results on every `percentageStep`.
				if (session.completionPercentage > completionPercentage) {
					completionPercentage =
						session.completionPercentage + percentageStep
					self.postMessage(updatedResultMessage(session))
					break
				}
			}
		}
		// If session is "done", notify UI.
		if (session.status === "done") {
			self.postMessage(updatedResultMessage(session))
			self.postMessage(statusChangedMessage(session))
		}
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
