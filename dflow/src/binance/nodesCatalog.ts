import { Dflow, DflowNode, DflowNodesCatalog } from "dflow"

import { nodesCatalog as commonNodesCatalog } from "../common/nodesCatalog.js"
import { dflowBinanceKlineIntervals } from "./klineIntervals.js"
import { pinIntervalName, pinSymbolName } from "./nodes/commonIO.js"
import { Candles, TickerPrice } from "./nodes/market.js"
import { IntervalParameter, SymbolParameter } from "./nodes/parameters.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"
import {
	DflowBinanceSymbolInfo,
	getDflowBinanceNodeSymbolKind,
	isDflowBinanceSymbolInfo
} from "./symbols.js"

const { output } = Dflow

type GetDflowBinanceNodesCatalog = (
	symbols: DflowBinanceSymbolInfo[]
) => DflowNodesCatalog

/**
 * Creates a dynamic set of dflow nodes generated according to Binance
 * definitions.
 */
export const getDflowBinanceDynamicNodesCatalog: GetDflowBinanceNodesCatalog = (
	symbols
) => {
	const klineIntervalNodes = dflowBinanceKlineIntervals.reduce(
		(catalog, klineInterval) => {
			class NodeClass extends DflowNode {
				static kind = klineInterval
				static outputs = [
					output("string", {
						name: pinIntervalName,
						data: klineInterval
					})
				]
			}
			return { ...catalog, [NodeClass.kind]: NodeClass }
		},
		{}
	)

	const symbolNodes = symbols
		.filter(isDflowBinanceSymbolInfo)
		.reduce((catalog, { baseAsset, quoteAsset, symbol }) => {
			class NodeClass extends DflowNode {
				static kind = getDflowBinanceNodeSymbolKind({
					baseAsset,
					quoteAsset
				})
				static outputs = [
					output("string", {
						name: pinSymbolName,
						data: symbol
					})
				]
			}
			return { ...catalog, [NodeClass.kind]: NodeClass }
		}, {})

	return {
		...klineIntervalNodes,
		...symbolNodes
	}
}

export const getDflowBinanceNodesCatalog: GetDflowBinanceNodesCatalog = (
	symbols
) => {
	const staticNodes = {
		// market
		[Candles.kind]: Candles,
		[TickerPrice.kind]: TickerPrice,
		// parameters
		[IntervalParameter.kind]: IntervalParameter,
		[SymbolParameter.kind]: SymbolParameter,
		// trade
		[BuyMarket.kind]: BuyMarket,
		[SellMarket.kind]: SellMarket,
		...commonNodesCatalog
	}

	const dynamicNodes = getDflowBinanceDynamicNodesCatalog(symbols)

	return {
		...dynamicNodes,
		...staticNodes
	}
}
