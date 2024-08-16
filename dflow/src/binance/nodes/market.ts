import { binanceKlineMaxLimit } from "@workspace/binance"
import { Dflow, DflowNode } from "dflow"

import { inputInterval, inputSymbol, outputClose, outputHigh, outputLow, outputOpen, outputPrice, outputVolume } from "../../common/nodes/commonIO.js"
import { DflowBinanceContext as Context } from "../context.js"
import { isDflowBinanceKlineInterval } from "../klineIntervals.js"

const { input } = Dflow

export class Candles extends DflowNode {
	static kind = "candles"
	static inputs = [
		inputSymbol,
		inputInterval,
		input("number", { name: "count" })
	]
	static outputs = [
		outputOpen,
		outputHigh,
		outputLow,
		outputClose,
		outputVolume
	]
	async run() {
		const { binance, defaults, time: currentTime } = this.host.context as Context
		const symbol = this.input(0).data ?? defaults.symbol
		const interval = this.input(1).data as string
		const count = this.input(2).data as number
		if (
			typeof symbol !== "string" ||
			!isDflowBinanceKlineInterval(interval) ||
			typeof count !== "number"
		) return this.clearOutputs()
		const limit = Math.min(count, binanceKlineMaxLimit)
		const klines = await binance.klines(symbol, interval, {
			endTime: currentTime,
			limit
		})
		const { open, high, low, close, volume } = klines.reduce<{
			open: number[]
			high: number[]
			low: number[]
			close: number[]
			volume: number[]
		}>(
			({ open, high, low, close, volume }, kline) => ({
				open: [...open, Number(kline[1])],
				high: [...high, Number(kline[2])],
				low: [...low, Number(kline[3])],
				close: [...close, Number(kline[4])],
				volume: [...volume, Number(kline[5])]
			}),
			{ open: [], high: [], low: [], close: [], volume: [] }
		)
		this.output(0).data = open
		this.output(1).data = high
		this.output(2).data = low
		this.output(3).data = close
		this.output(4).data = volume
	}
}

export class TickerPrice extends DflowNode {
	static kind = "price"
	static inputs = [inputSymbol]
	static outputs = [outputPrice]
	async run() {
		const { binance, defaults } = this.host.context as Context
		const symbol = this.input(0).data ?? defaults.symbol

		if (typeof symbol !== "string") return this.clearOutputs()
		const data = await binance.tickerPrice(symbol)
		this.output(0).data = Number(data.price)
	}
}
