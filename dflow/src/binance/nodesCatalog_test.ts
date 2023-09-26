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
				// "1s",
				// "1m",
				// "3m",
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
				"1w",
				"3d",
				"1M",
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

	test("creates a Dflow node for a Binance symbol if it is a valid DflowBinanceSymbolInfo", async () => {
		const validSymbol: DflowBinanceSymbolInfo = {
			symbol: "AAABTC",
			status: "TRADING",
			baseAsset: "AAA",
			baseAssetPrecision: 8,
			quoteAsset: "BTC",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			isSpotTradingAllowed: true,
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
				quotePrecision: 8,
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
				quotePrecision: 8,
				quoteAssetPrecision: 8,
				baseCommissionPrecision: 8,
				// isSpotTradingAllowed is not true
				isSpotTradingAllowed: false,
				filters: []
			},
			{
				symbol: "XXCBUSD",
				status: "TRADING",
				baseAsset: "XXC",
				// baseAssetPrecision is not 8
				baseAssetPrecision: 1,
				quoteAsset: "BUSD",
				quotePrecision: 8,
				quoteAssetPrecision: 8,
				baseCommissionPrecision: 8,
				// isSpotTradingAllowed is not true
				isSpotTradingAllowed: false,
				filters: []
			},
			{
				// symbol mismatch with baseAsset/quoteAsset
				symbol: "XXXBUSD",
				status: "TRADING",
				baseAsset: "XXE",
				baseAssetPrecision: 8,
				quoteAsset: "BUSD",
				quotePrecision: 8,
				quoteAssetPrecision: 8,
				baseCommissionPrecision: 8,
				isSpotTradingAllowed: true,
				filters: []
			}
		]

		const symbols = [validSymbol, ...invalidSymbols]
		const nodesCatalog = getDflowBinanceDynamicNodesCatalog(symbols)

		// Valid node.
		assert.ok(nodesCatalog["AAA/BTC"] !== undefined)
		// Invalid nodes.
		assert.ok(nodesCatalog["XXA/BUSD"] === undefined)
		assert.ok(nodesCatalog["XXB/BUSD"] === undefined)
		assert.ok(nodesCatalog["XXC/BUSD"] === undefined)
		assert.ok(nodesCatalog["XXD/YYYY"] === undefined)
		assert.ok(nodesCatalog["XXE/BUSD"] === undefined)
	})
})
