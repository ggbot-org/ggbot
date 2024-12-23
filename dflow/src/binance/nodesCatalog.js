import { Dflow, DflowNode } from 'dflow'

import { pinIntervalName, pinSymbolName } from '../common/nodes/commonIO.js'
import { nodesCatalog as commonNodesCatalog } from '../common/nodesCatalog.js'
import { dflowBinanceKlineIntervals } from './klineIntervals.js'
import { Candles, TickerPrice } from './nodes/market.js'
import { IntervalParameter, SymbolParameter } from './nodes/parameters.js'
import { BuyMarket, OrderInfo, SellMarket } from './nodes/trade.js'
import { getDflowBinanceNodeSymbolKind } from './symbols.js'

const { output } = Dflow

/** @type {import('./nodesCatalog').getDflowBinanceDynamicNodesCatalog} */
export function getDflowBinanceDynamicNodesCatalog(symbols) {
	return {
		// klineIntervalNodes
		...dflowBinanceKlineIntervals.reduce(
			(catalog, klineInterval) => {
				class NodeClass extends DflowNode {
					static kind = klineInterval
					static outputs = [
						output('string', { name: pinIntervalName, data: klineInterval })
					]
				}
				return { ...catalog, [NodeClass.kind]: NodeClass }
			}, {}),
		// symbolNodes
		...symbols.filter(
			({ isSpotTradingAllowed, status }) => (isSpotTradingAllowed && status === 'TRADING')
		).reduce(
			(catalog, { baseAsset, quoteAsset, symbol }) => {
				class NodeClass extends DflowNode {
					static kind = getDflowBinanceNodeSymbolKind({ baseAsset, quoteAsset })
					static outputs = [
						output('string', { name: pinSymbolName, data: symbol })
					]
				}
				return { ...catalog, [NodeClass.kind]: NodeClass }
			}, {}),
	}
}

/** @type {import('./nodesCatalog').getDflowBinanceNodesCatalog} */
export function getDflowBinanceNodesCatalog(symbols) {
	return {
		// market
		[Candles.kind]: Candles,
		[TickerPrice.kind]: TickerPrice,
		// parameters
		[IntervalParameter.kind]: IntervalParameter,
		[SymbolParameter.kind]: SymbolParameter,
		// trade
		[BuyMarket.kind]: BuyMarket,
		[SellMarket.kind]: SellMarket,
		[OrderInfo.kind]: OrderInfo,
		// common nodes
		...commonNodesCatalog,
		// dynamicNodes
		...getDflowBinanceDynamicNodesCatalog(symbols),
	}
}
