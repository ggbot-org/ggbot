import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import {
	extractBinanceSymbolsAndIntervalsFromFlowCandles,
	extractsBinanceSymbolsFromTickerPriceAndOrderNodes
} from "./flow.js"
import { DflowBinanceClientMock } from "./mocks/client.js"
import { Candles, TickerPrice } from "./nodes/market.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"

void test("extractBinanceSymbolsAndIntervalsFromFlowCandles", async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()
	assertDeepEqual<
		Parameters<typeof extractBinanceSymbolsAndIntervalsFromFlowCandles>[1],
		ReturnType<typeof extractBinanceSymbolsAndIntervalsFromFlowCandles>
	>(
		(
			flow: Parameters<
				typeof extractBinanceSymbolsAndIntervalsFromFlowCandles
			>[1]
		) => extractBinanceSymbolsAndIntervalsFromFlowCandles(symbols, flow),
		[
			{
				input: {
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
							text: "1h",
							x: 0,
							y: 0,
							outs: [{ id: "oa2" }]
						},
						{
							id: "a3",
							text: Candles.kind,
							x: 0,
							y: 0,
							ins: [{ id: "ai1" }, { id: "ai2" }, { id: "ai3" }]
						},
						{ id: "b1", text: "BTC/BUSD", x: 0, y: 0 },
						{
							id: "b2",
							text: "1d",
							x: 0,
							y: 0,
							outs: [{ id: "ob2" }]
						},
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
				},
				output: [
					{ symbol: "BTCBUSD", interval: "1d" },
					{ symbol: "ETHBTC", interval: "1h" }
				]
			},

			// It manages duplicates.
			{
				input: {
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
							text: "1h",
							x: 0,
							y: 0,
							outs: [{ id: "oa2" }]
						},
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
						{
							id: "b2",
							text: "1h",
							x: 0,
							y: 0,
							outs: [{ id: "ob2" }]
						},
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
				},
				output: [{ symbol: "ETHBTC", interval: "1h" }]
			}
		]
	)
})

void test("extractsBinanceSymbolsFromTickerPriceAndOrderNodes", async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()
	assertDeepEqual<
		Parameters<
			typeof extractsBinanceSymbolsFromTickerPriceAndOrderNodes
		>[1],
		ReturnType<typeof extractsBinanceSymbolsFromTickerPriceAndOrderNodes>
	>(
		(
			flow: Parameters<
				typeof extractsBinanceSymbolsFromTickerPriceAndOrderNodes
			>[1]
		) => extractsBinanceSymbolsFromTickerPriceAndOrderNodes(symbols, flow),
		[
			{
				input: {
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
				},
				output: ["BTCBUSD", "ETHBTC"]
			},

			// It manages duplicates.
			{
				input: {
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
				},
				output: ["ETHBTC"]
			}
		]
	)
})
