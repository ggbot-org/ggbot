import { BinanceOrder, numberToBinanceDecimal } from "@workspace/binance"
import { Dflow, DflowNode, DflowOutputDefinition } from "dflow"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { inputExecute, inputOrderQuantity, inputSymbol, outputOrderQuantity, outputSymbol } from "../../common/nodes/commonIO.js"
import { DflowBinanceContext as Context } from "../context.js"

const { input, output } = Dflow

const marketOrderInputs = [
	inputSymbol,
	inputOrderQuantity,
	input("number", { name: "quoteOrderQty", optional: true }),
	inputExecute
]
const orderOutput = output("object", { name: "order" })
export const orderOutputPosition = 0
const outputs: DflowOutputDefinition[] = []
outputs[orderOutputPosition] = orderOutput

export class BuyMarket extends DflowNode {
	static kind = "buyMarket"
	static inputs = marketOrderInputs
	static outputs = outputs
	async run() {
		const { binance, defaults } = this.host.context as Context
		const symbol = this.input(0).data ?? defaults.symbol
		const quantity = this.input(1).data as number | undefined
		const quoteOrderQty = this.input(2).data as number | undefined
		const execute = this.input(3).data
		if (
			typeof symbol !== "string" ||
			(quantity === undefined && quoteOrderQty === undefined) ||
			!execute
		) return this.clearOutputs()
		const symbolInfo = await binance.symbolInfo(symbol)
		if (!symbolInfo) return this.clearOutputs()
		const order = await binance.newOrder(symbol, "BUY", "MARKET", {
			quantity:
				quantity === undefined
					? undefined
					: numberToBinanceDecimal(
						quantity,
						symbolInfo.baseAssetPrecision
					),
			quoteOrderQty:
				quoteOrderQty === undefined
					? undefined
					: numberToBinanceDecimal(
						quoteOrderQty,
						symbolInfo.quotePrecision
					)
		})
		this.output(0).data = order
	}
}

export class SellMarket extends DflowNode {
	static kind = "sellMarket"
	static inputs = marketOrderInputs
	static outputs = outputs
	async run() {
		const { binance, defaults } = this.host.context as Context
		const symbol = this.input(0).data ?? defaults.symbol
		const quantity = this.input(1).data as number | undefined
		const quoteOrderQty = this.input(2).data as number | undefined
		const execute = this.input(3).data
		if (
			typeof symbol !== "string" ||
			(quantity === undefined && quoteOrderQty === undefined) ||
			!execute
		) return this.clearOutputs()
		const symbolInfo = await binance.symbolInfo(symbol)
		if (!symbolInfo) return this.clearOutputs()
		const order = await binance.newOrder(symbol, "SELL", "MARKET", {
			quantity:
				quantity === undefined
					? undefined
					: numberToBinanceDecimal(
						quantity,
						symbolInfo.baseAssetPrecision
					),
			quoteOrderQty:
				quoteOrderQty === undefined
					? undefined
					: numberToBinanceDecimal(
						quoteOrderQty,
						symbolInfo.quotePrecision
					)
		})
		this.output(0).data = order
	}
}

const isOrderInfo = objectTypeGuard<Pick<BinanceOrder, "side" | "symbol" | "executedQty"> >(
	({ side, symbol, executedQty }) => typeof side === "string" && typeof symbol === "string" && typeof executedQty === "string"
)

export class OrderInfo extends DflowNode {
	static kind = "orderInfo"
	static inputs = [
		input("object", { name: "order" })
	]
	static outputs = [
		output("string", { name: "side" }),
		outputSymbol,
		outputOrderQuantity
	]
	run () {
		const order = this.input(0).data
		if (!isOrderInfo(order)) return this.clearOutputs()
		this.output(0).data = order.side
		this.output(1).data = order.symbol
		this.output(2).data = Number(order.executedQty)
	}
}
