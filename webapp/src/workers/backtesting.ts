/// <reference no-default-lib="true"/>
/// <reference lib="ES2017" />
/// <reference lib="webworker" />

import {
	BacktestingBinanceClient,
	BacktestingMessageIn,
	BacktestingMessageOut,
	BacktestingSession
} from "@workspace/backtesting"
import { BinanceKlinesCacheMap } from "@workspace/binance"

const binance = new BacktestingBinanceClient()
binance.klinesCache = new BinanceKlinesCacheMap()
// TODO try two backtests,  open two browser tabs on two different strategies or on the same strategy
// is this `session` shared?
const session = new BacktestingSession()

const statusChangedMessage = (
	session: BacktestingSession
): BacktestingMessageOut => ({
	type: "STATUS_CHANGED",
	status: session.status
})

self.onmessage = (event: MessageEvent<BacktestingMessageIn>) => {
	const message = event.data

	if (message.type === "START") {
		const { dayInterval, frequency, strategy } = message
		// Set `strategy` session.
		if (!strategy) return
		session.strategy = strategy
		const {
			strategyKey: { strategyKind }
		} = strategy
		// Set `frequency` and `dayInterval` session, then compute timestamps.
		if (!frequency || !dayInterval) return
		session.dayInterval = message.dayInterval
		session.frequency = message.frequency
		session.computeTimes()
		// Start session and notify UI.
		const statusChanged = session.start()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
		// Run backtesting according to given `strategyKind`.
		if (strategyKind === "binance") {
			// TODO pre-fetch klines and update klinesCache
			// it could also get data from indexed db
			//
			// binance.klinesCache?.setKline(symbol,)
			//
			// const symbolsAndIntervals =
			// extractBinanceFlowSymbolsAndIntervalsFromFlow(
			// 	binanceSymbols,
			// 	flowViewGraph
			// )
			while (session.status === "running") {
				binance.time = session.nextTime
			}
		}
		// End session and notify UI.
		if (session.status === "done") {
			self.postMessage({ type: "STATUS_CHANGED", status: "done" })
		}
	}

	if (message.type === "STOP") {
		const statusChanged = session.stop()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}

	if (message.type === "PAUSE") {
		const statusChanged = session.pause()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}

	if (message.type === "RESUME") {
		const statusChanged = session.resume()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}
}
