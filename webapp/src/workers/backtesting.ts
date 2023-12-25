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
	extractBinanceFlowSymbolsAndIntervalsFromFlow,
	getDflowBinanceNodesCatalog
} from "@workspace/dflow"
import { newId } from "@workspace/models"
import { Time } from "minimal-time-helpers"

import { BinanceExchangeInfoCache } from "../binance/exchangeInfoCache"
import { logging } from "../logging"

const { warn } = logging("backtesting")

const binanceExecutor = new DflowBinanceExecutor()
const binance = new BacktestingBinanceClient()
binance.exchangeInfoCache = new BinanceExchangeInfoCache()
binance.klinesCache = new BinanceKlinesCacheMap()

const session = new BacktestingSession()

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
	stepIndex: session.stepIndex,
	numSteps: session.numSteps
})

const updatedResultsMessage = (
	session: BacktestingSession
): BacktestingMessageOutData => ({
	type: "UPDATED_RESULTS",
	balanceHistory: session.balanceHistory,
	memory: session.memory,
	orders: session.orders
})

const POST = (message: BacktestingMessageOutData) => {
	self.postMessage(message)
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
		if (statusChanged) POST(statusChangedMessage(session))
		if (!session.canRun) return

		// Run backtesting according to given `strategyKind`.
		const { strategyKind } = strategyKey
		const percentageStep = 5
		let completionPercentage = percentageStep
		if (strategyKind === "binance") {
			const { symbols: binanceSymbols } = await binance.exchangeInfo()
			binanceExecutor.nodesCatalog =
				getDflowBinanceNodesCatalog(binanceSymbols)

			// Pre-fetch klines by extracted `symbolsAndIntervals` and given `session.times`.

			const symbolsAndIntervals =
				extractBinanceFlowSymbolsAndIntervalsFromFlow(
					binanceSymbols,
					view
				)

			const firstTime = session.times[0]
			const lastTime = session.times[session.times.length - 1]
			for (const { interval, symbol } of symbolsAndIntervals) {
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

			// Pre-fetch klines for `tickerPrice()` by given `session.frequency` and `session.times`.
			// TODO

			let time: Time | undefined
			while ((time = session.nextTime)) {
				binance.time = time
				// Run executor.
				try {
					const { balances, memory, memoryChanged, orders } =
						await binanceExecutor.run(
							{
								binance,
								params: {},
								memory: session.memory,
								time
							},
							view
						)
					session.memory = memory
					if (balances.length > 0)
						session.balanceHistory.push({
							balances,
							whenCreated: time
						})
					for (const { info } of orders)
						session.orders.push({
							id: newId(),
							info,
							whenCreated: time
						})
					// Update UI, if memory changed or there was some new balance or order.
					if (memoryChanged || balances.length + orders.length > 0)
						POST(updatedResultsMessage(session))
				} catch (error) {
					warn(error)
					const statusChanged = session.stop()
					if (statusChanged) POST(statusChangedMessage(session))
				}

				// Update UI with current progress on every `percentageStep`.
				if (session.completionPercentage > completionPercentage) {
					completionPercentage =
						session.completionPercentage + percentageStep
					POST(updatedProgressMessage(session))
				}
			}
		}
		// If session is "done", notify UI.
		if (session.status === "done") {
			POST(updatedProgressMessage(session))
			POST(updatedResultsMessage(session))
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
		const statusChanged = session.resume()
		if (statusChanged) POST(statusChangedMessage(session))
	}
}
