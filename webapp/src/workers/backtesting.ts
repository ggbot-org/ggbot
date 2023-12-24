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
import { now, Time } from "minimal-time-helpers"

import { BinanceExchangeInfoCache } from "../binance/exchangeInfoCache"
import { logging } from "../logging"

const { warn } = logging("backtesting")

const binanceKlinesCache = new BinanceKlinesCacheMap()
const binanceExchangeInfoCache = new BinanceExchangeInfoCache()
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
		session.dayInterval = dayInterval
		self.postMessage({
			type: "UPDATED_DAY_INTERVAL",
			dayInterval: session.dayInterval
		} satisfies BacktestingMessageOutData)
		return
	}

	if (message.type === "SET_FREQUENCY") {
		const { frequency } = message
		session.frequency = frequency
		self.postMessage({
			type: "UPDATED_FREQUENCY",
			frequency: session.frequency
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
			const binance = new BacktestingBinanceClient(now())
			binance.exchangeInfoCache = binanceExchangeInfoCache
			binance.klinesCache = binanceKlinesCache
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
					if (orders.length > 0)
						session.orders.push(
							...orders.map(({ info }) => ({
								id: newId(),
								info,
								whenCreated: time
							}))
						)
					// Always update UI whenever `memoryChanged`.
					if (memoryChanged)
						self.postMessage(updatedResultMessage(session))
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
