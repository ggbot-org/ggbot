/* eslint-disable sort-keys */
import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { BinanceClientMock } from "./mocks/client.js"
import { getDflowBinanceDynamicNodesCatalog } from "./nodesCatalog.js"
import { DflowBinanceSymbolInfo } from "./symbols.js"

describe("getDflowBinanceDynamicNodesCatalog", () => {
	it("creates Dflow nodes related with Binance symbols", async () => {
		const binance = new BinanceClientMock()
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

	it("creates a Dflow node for a Binance symbol if it is a valid DflowBinanceSymbolInfo", async () => {
		const validSymbol: DflowBinanceSymbolInfo = {
			symbol: "AAABTC",
			status: "TRADING",
			baseAsset: "AAA",
			baseAssetPrecision: 8,
			quoteAsset: "BTC",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			isSpotTradingAllowed: true
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
				isSpotTradingAllowed: true
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
				isSpotTradingAllowed: false
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
				isSpotTradingAllowed: false
			},
			{
				symbol: "XXDYYY",
				status: "TRADING",
				baseAsset: "XXD",
				baseAssetPrecision: 8,
				// quoteAsset is not in dflowBinanceQuoteAssets list
				quoteAsset: "YYY",
				quotePrecision: 8,
				quoteAssetPrecision: 8,
				baseCommissionPrecision: 8,
				isSpotTradingAllowed: true
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
				isSpotTradingAllowed: true
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
