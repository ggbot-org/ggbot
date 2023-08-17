import { coerceToDecimal } from "@ggbot2/arithmetic"
import { DflowNode } from "dflow"

import { inputExecute } from "../../common/nodes/commonIO.js"
import { dflowBinancePrecision } from "../arithmetic.js"
import { BinanceDflowContext as Context } from "../context.js"

const { input, output } = DflowNode

const marketOrderInputs = [
	input("string", { name: "symbol" }),
	input("number", { name: "quantity", optional: true }),
	input("number", { name: "quoteOrderQty", optional: true }),
	inputExecute
]
const orderOutput = output("object", { name: "order" })
export const orderOutputPosition = 0
const outputs = new Array()
outputs[orderOutputPosition] = orderOutput

export class BuyMarket extends DflowNode {
	static kind = "buyMarket"
	static inputs = marketOrderInputs
	static outputs = outputs
	async run() {
		const { binance } = this.host.context as Context
		const symbol = this.input(0).data as string
		const quantity = this.input(1).data as number | undefined
		const quoteOrderQty = this.input(2).data as number | undefined
		const execute = this.input(3).data as boolean | undefined
		if (!execute) return this.clearOutputs()
		if (quantity === undefined && quoteOrderQty === undefined)
			return this.clearOutputs()
		const isBinanceSymbol = await binance.isBinanceSymbol(symbol)
		if (!isBinanceSymbol) return this.clearOutputs()
		const order = await binance.newOrder(symbol, "BUY", "MARKET", {
			quantity:
				quantity === undefined
					? undefined
					: coerceToDecimal(quantity, dflowBinancePrecision),
			quoteOrderQty:
				quoteOrderQty === undefined
					? undefined
					: coerceToDecimal(quoteOrderQty, dflowBinancePrecision)
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
		const symbol = this.input(0).data as string
		const quantity = this.input(1).data as number | undefined
		const quoteOrderQty = this.input(2).data as number | undefined
		const execute = this.input(3).data as boolean | undefined
		if (!execute) return this.clearOutputs()
		if (quantity === undefined && quoteOrderQty === undefined)
			return this.clearOutputs()
		const isBinanceSymbol = await binance.isBinanceSymbol(symbol)
		if (!isBinanceSymbol) return this.clearOutputs()
		const order = await binance.newOrder(symbol, "SELL", "MARKET", {
			quantity:
				quantity === undefined
					? undefined
					: coerceToDecimal(quantity, dflowBinancePrecision),
			quoteOrderQty:
				quoteOrderQty === undefined
					? undefined
					: coerceToDecimal(quoteOrderQty, dflowBinancePrecision)
		})
		this.output(0).data = order
	}
}
