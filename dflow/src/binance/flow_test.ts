import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { FlowViewSerializableGraph } from "flow-view"

import {
	extractBinanceSymbolsAndIntervalsFromFlowCandles,
	extractsBinanceSymbolsFromTickerPriceAndOrderNodes
} from "./flow.js"
import { DflowBinanceClientMock } from "./mocks/client.js"
import { Candles, TickerPrice } from "./nodes/market.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"

void describe("extractBinanceSymbolsAndIntervalsFromFlowCandles", () => {
	void test("extracts symbol and interval tuples", async () => {
		const binance = new DflowBinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		const view: FlowViewSerializableGraph = {
			nodes: [
				{
					id: "a1",
					text: "ETH/BTC",
					x: 0,
					y: 0,
					outs: [{ id: "oa1" }]
				},
				{ id: "a2", text: "1h", x: 0, y: 0, outs: [{ id: "oa2" }] },
				{
					id: "a3",
					text: Candles.kind,
					x: 0,
					y: 0,
					ins: [{ id: "ai1" }, { id: "ai2" }, { id: "ai3" }]
				},
				{ id: "b1", text: "BTC/BUSD", x: 0, y: 0 },
				{ id: "b2", text: "1d", x: 0, y: 0, outs: [{ id: "ob2" }] },
				{
					id: "b3",
					text: Candles.kind,
					x: 0,
					y: 0,
					ins: [{ id: "bi1" }, { id: "bi2" }, { id: "bi3" }]
				}
			],
			edges: [
				{ id: "ea1", from: ["a1", "oa1"], to: ["a3", "ai1"] },
				{ id: "ea2", from: ["a2", "oa2"], to: ["a3", "ai2"] },
				{ id: "eb1", from: ["b1", "ob1"], to: ["b3", "bi1"] },
				{ id: "eb2", from: ["b2", "ob2"], to: ["b3", "bi2"] }
			]
		}
		assert.deepEqual(
			extractBinanceSymbolsAndIntervalsFromFlowCandles(symbols, view),
			[
				{ symbol: "BTCBUSD", interval: "1d" },
				{ symbol: "ETHBTC", interval: "1h" }
			]
		)
	})

	void test("manages duplicates", async () => {
		const binance = new DflowBinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		const view: FlowViewSerializableGraph = {
			nodes: [
				{
					id: "a1",
					text: "ETH/BTC",
					x: 0,
					y: 0,
					outs: [{ id: "oa1" }]
				},
				{ id: "a2", text: "1h", x: 0, y: 0, outs: [{ id: "oa2" }] },
				{
					id: "a3",
					text: Candles.kind,
					x: 0,
					y: 0,
					ins: [{ id: "ai1" }, { id: "ai2" }, { id: "ai3" }]
				},
				// Should not return ["ETHBTC", "1h"] twice.
				{
					id: "b1",
					text: "ETH/BTC",
					x: 0,
					y: 0,
					outs: [{ id: "ob1" }]
				},
				{ id: "b2", text: "1h", x: 0, y: 0, outs: [{ id: "ob2" }] },
				{
					id: "b3",
					text: Candles.kind,
					x: 0,
					y: 0,
					ins: [{ id: "bi1" }, { id: "bi2" }, { id: "bi3" }]
				}
			],
			edges: [
				{ id: "ea1", from: ["a1", "oa1"], to: ["a3", "ai1"] },
				{ id: "ea2", from: ["a2", "oa2"], to: ["a3", "ai2"] },
				{ id: "eb1", from: ["b1", "ob1"], to: ["b3", "bi1"] },
				{ id: "eb2", from: ["b2", "ob2"], to: ["b3", "bi2"] }
			]
		}
		assert.deepEqual(
			extractBinanceSymbolsAndIntervalsFromFlowCandles(symbols, view),
			[{ symbol: "ETHBTC", interval: "1h" }]
		)
	})
})

void describe("extractsBinanceSymbolsFromTickerPriceAndOrderNodes", () => {
	void test("extracts symbols", async () => {
		const binance = new DflowBinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		const view: FlowViewSerializableGraph = {
			nodes: [
				{
					id: "a1",
					text: "ETH/BTC",
					x: 0,
					y: 0,
					outs: [{ id: "oa1" }]
				},
				{
					id: "a2",
					text: BuyMarket.kind,
					x: 0,
					y: 0,
					ins: [{ id: "ai1" }],
					outs: [{ id: "oa2" }]
				},
				{ id: "b1", text: "BTC/BUSD", x: 0, y: 0 },
				{
					id: "b2",
					text: TickerPrice.kind,
					x: 0,
					y: 0,
					ins: [{ id: "bi1" }],
					outs: [{ id: "oa2" }]
				}
			],
			edges: [
				{ id: "ea1", from: ["a1", "oa1"], to: ["a2", "ai1"] },
				{ id: "eb1", from: ["b1", "ob1"], to: ["b2", "bi1"] }
			]
		}
		assert.deepEqual(
			extractsBinanceSymbolsFromTickerPriceAndOrderNodes(symbols, view),
			["BTCBUSD", "ETHBTC"]
		)
	})

	void test("manages duplicates", async () => {
		const binance = new DflowBinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		const view: FlowViewSerializableGraph = {
			nodes: [
				{
					id: "a1",
					text: "ETH/BTC",
					x: 0,
					y: 0,
					outs: [{ id: "oa1" }]
				},
				{
					id: "a2",
					text: SellMarket.kind,
					x: 0,
					y: 0,
					ins: [{ id: "ai1" }],
					outs: [{ id: "oa2" }]
				},
				// Should not return "ETHBTC" twice.
				{
					id: "b1",
					text: "ETH/BTC",
					x: 0,
					y: 0,
					outs: [{ id: "ob1" }]
				},
				{
					id: "b2",
					text: TickerPrice.kind,
					x: 0,
					y: 0,
					ins: [{ id: "bi1" }],
					outs: [{ id: "ob2" }]
				}
			],
			edges: [
				{ id: "ea1", from: ["a1", "oa1"], to: ["a2", "ai1"] },
				{ id: "eb1", from: ["b1", "ob1"], to: ["b2", "bi1"] }
			]
		}
		assert.deepEqual(
			extractsBinanceSymbolsFromTickerPriceAndOrderNodes(symbols, view),
			["ETHBTC"]
		)
	})
})
