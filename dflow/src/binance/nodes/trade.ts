import { coerceToDecimal } from "@workspace/arithmetic"
import { DflowNode, DflowOutputDefinition } from "dflow"

import { inputExecute } from "../../common/nodes/commonIO.js"
import { DflowBinanceContext as Context } from "../context.js"

const { input, output } = DflowNode

const marketOrderInputs = [
	input("string", { name: "symbol" }),
	input("number", { name: "quantity", optional: true }),
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
		const { binance } = this.host.context as Context
		const symbol = this.input(0).data
		const quantity = this.input(1).data
		const quoteOrderQty = this.input(2).data
		const execute = this.input(3).data
		if (
			typeof symbol !== "string" ||
			(quantity === undefined && quoteOrderQty === undefined) ||
			!execute
		)
			return this.clearOutputs()
		const symbolInfo = await binance.symbolInfo(symbol)
		if (!symbolInfo) return this.clearOutputs()
		const order = await binance.newOrder(symbol, "BUY", "MARKET", {
			quantity:
				quantity === undefined
					? undefined
					: coerceToDecimal(quantity, symbolInfo.baseAssetPrecision),
			quoteOrderQty:
				quoteOrderQty === undefined
					? undefined
					: coerceToDecimal(quoteOrderQty, symbolInfo.quotePrecision)
		})
		this.output(0).data = order
	}
}

export class SellMarket extends DflowNode {
	static kind = "sellMarket"
	static inputs = marketOrderInputs
	static outputs = outputs
	async run() {
		const { binance } = this.host.context as Context
		const symbol = this.input(0).data
		const quantity = this.input(1).data
		const quoteOrderQty = this.input(2).data
		const execute = this.input(3).data
		if (
			typeof symbol !== "string" ||
			(quantity === undefined && quoteOrderQty === undefined) ||
			!execute
		)
			return this.clearOutputs()
		const symbolInfo = await binance.symbolInfo(symbol)
		if (!symbolInfo) return this.clearOutputs()
		const order = await binance.newOrder(symbol, "SELL", "MARKET", {
			quantity:
				quantity === undefined
					? undefined
					: coerceToDecimal(quantity, symbolInfo.baseAssetPrecision),
			quoteOrderQty:
				quoteOrderQty === undefined
					? undefined
					: coerceToDecimal(quoteOrderQty, symbolInfo.quotePrecision)
		})
		this.output(0).data = order
	}
}
