import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { DflowBinanceClientMock } from "./mocks/client.js"
import { getDflowBinanceDynamicNodesCatalog } from "./nodesCatalog.js"
import { DflowBinanceSymbolInfo } from "./symbols.js"

describe("getDflowBinanceDynamicNodesCatalog", () => {
	test("creates Dflow nodes related with Binance symbols", async () => {
		const binance = new DflowBinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		const nodesCatalog = getDflowBinanceDynamicNodesCatalog(symbols)
		assert.deepEqual(
			Object.keys(nodesCatalog).sort(),
			[
				// intervals
				// ////////
				// "1s", // excluded from `binanceKlineIntervals`
				"1m",
				"3m",
				"5m",
				"15m",
				"30m",
				"1h",
				"2h",
				"4h",
				"6h",
				"8h",
				"12h",
				"1d",
				// "1w", // excluded from `binanceKlineIntervals`
				// "3d", // excluded from `binanceKlineIntervals`
				// "1M", // excluded from `binanceKlineIntervals`

				// symbols
				// //////
				"BNB/BTC",
				"BNB/BUSD",
				"BNB/ETH",
				"BTC/BUSD",
				"ETH/BTC",
				"ETH/BUSD"
			].sort()
		)
	})

	test("creates a Dflow node for a Binance symbol if it is a valid DflowBinanceSymbolInfo", () => {
		const validSymbol: DflowBinanceSymbolInfo = {
			symbol: "AAABTC",
			baseAsset: "AAA",
			baseAssetPrecision: 8,
			quoteAsset: "BTC",
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			isSpotTradingAllowed: true,
			status: "TRADING",
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.01000000",
					maxPrice: "1000000.00000000",
					tickSize: "0.01000000"
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00001000",
					maxQty: "9000.00000000",
					stepSize: "0.00001000"
				},
				{
					filterType: "ICEBERG_PARTS",
					limit: 10
				},
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "147.07085284",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{
					filterType: "MAX_NUM_ORDERS",
					maxNumOrders: 200
				},
				{
					filterType: "MAX_NUM_ALGO_ORDERS",
					maxNumAlgoOrders: 5
				}
			]
		}

		const invalidSymbols: DflowBinanceSymbolInfo[] = [
			{
				symbol: "XXABUSD",
				// status is not "TRADING"
				status: "BREAK",
				baseAsset: "XXA",
				baseAssetPrecision: 8,
				quoteAsset: "BUSD",
				quoteAssetPrecision: 8,
				baseCommissionPrecision: 8,
				isSpotTradingAllowed: true,
				filters: []
			},
			{
				symbol: "XXBBUSD",
				status: "TRADING",
				baseAsset: "XXB",
				baseAssetPrecision: 8,
				quoteAsset: "BUSD",
				quoteAssetPrecision: 8,
				baseCommissionPrecision: 8,
				// isSpotTradingAllowed is not true
				isSpotTradingAllowed: false,
				filters: []
			},
		]

		const symbols = [validSymbol, ...invalidSymbols]
		const nodesCatalog = getDflowBinanceDynamicNodesCatalog(symbols)

		// Valid node.
		assert.ok(nodesCatalog["AAA/BTC"] !== undefined)
		// Invalid nodes.
		assert.ok(nodesCatalog["XXA/BUSD"] === undefined)
		assert.ok(nodesCatalog["XXB/BUSD"] === undefined)
	})
})
