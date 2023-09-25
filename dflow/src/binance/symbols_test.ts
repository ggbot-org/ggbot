/* eslint-disable sort-keys */
import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { StrategyFlow } from "@workspace/models"

import { DflowBinanceClientMock } from "./mocks/client.js"
import { extractBinanceFlowSymbolsAndIntervalsFromFlow } from "./symbols.js"

describe("extractBinanceFlowSymbolsAndIntervalsFromFlow", () => {
	it("extracts symbol and interval tuples", async () => {
		const binance = new DflowBinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		const view: StrategyFlow["view"] = {
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
					text: "candles",
					x: 0,
					y: 0,
					ins: [{ id: "ai1" }, { id: "ai2" }, { id: "ai3" }]
				},
				{ id: "b1", text: "BTC/BUSD", x: 0, y: 0 },
				{ id: "b2", text: "1d", x: 0, y: 0, outs: [{ id: "ob2" }] },
				{
					id: "b3",
					text: "candles",
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
			extractBinanceFlowSymbolsAndIntervalsFromFlow(symbols, view),
			[
				{ symbol: "BTCBUSD", interval: "1d" },
				{ symbol: "ETHBTC", interval: "1h" }
			]
		)
	})

	it("manages duplicates", async () => {
		const binance = new DflowBinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		const view: StrategyFlow["view"] = {
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
					text: "candles",
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
					text: "candles",
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
			extractBinanceFlowSymbolsAndIntervalsFromFlow(symbols, view),
			[{ symbol: "ETHBTC", interval: "1h" }]
		)
	})
})
