import { BacktestingBinanceClient, BacktestingSession, BacktestingStrategy } from "@workspace/backtesting"
import { binanceKlineMaxLimit, getBinanceIntervalTime } from "@workspace/binance"
import { DflowBinanceExecutor, extractBinanceSymbolsAndIntervalsFromFlow, extractsBinanceSymbolsFromFlow, getDflowBinanceNodesCatalog } from "@workspace/dflow"
import { BinanceExchangeInfoCacheIDB, BinanceIDB, BinanceKlinesCacheIDB } from "@workspace/indexeddb-binance"

const binanceIDB = new BinanceIDB()
const binanceExchangeInfoCache = new BinanceExchangeInfoCacheIDB(binanceIDB)
const binanceKlinesCache = new BinanceKlinesCacheIDB(binanceIDB)

export function getBinance(
	schedulingInterval: BacktestingBinanceClient["schedulingInterval"]
) {
	const binance = new BacktestingBinanceClient(schedulingInterval)
	binance.publicClient.exchangeInfoCache = binanceExchangeInfoCache
	binance.publicClient.klinesCache = binanceKlinesCache
	return binance
}

export async function prepareBinance(
	binance: BacktestingBinanceClient,
	binanceExecutor: DflowBinanceExecutor,
	session: BacktestingSession,
	schedulingInterval: BacktestingBinanceClient["schedulingInterval"],
	flow: BacktestingStrategy["flow"]
) {
	const { symbols: binanceSymbols } = await binance.exchangeInfo()
	binanceExecutor.nodesCatalog = getDflowBinanceNodesCatalog(binanceSymbols)

	const firstTime = session.times[0]
	const lastTime = session.times[session.times.length - 1]

	// Pre-fetch klines for "candles" nodes.

	const symbolsAndIntervalsFromCandlesNodes = await extractBinanceSymbolsAndIntervalsFromFlow(binanceSymbols, flow)

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

	const symbolsFromNodes = await extractsBinanceSymbolsFromFlow(
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
