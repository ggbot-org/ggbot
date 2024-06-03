import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import {
	extractBinanceParameters,
	extractBinanceSymbolsAndIntervalsFromFlowCandles,
	extractsBinanceSymbolsFromTickerPriceAndOrderNodes
} from "./flow.js"
import { DflowBinanceClientMock } from "./mocks/client.js"
import { Candles, TickerPrice } from "./nodes/market.js"
import { IntervalParameter, SymbolParameter } from "./nodes/parameters.js"
import { BuyMarket, SellMarket } from "./nodes/trade.js"

test("extractCommonParameters", async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()
	const intervalValue = "1h"
	const intervalKey = "my interval"
	const symbolValue = "BTC/BUSD"
	const symbolKey = "my symbol"
	assertDeepEqual<
		Parameters<typeof extractBinanceParameters>[1],
		ReturnType<typeof extractBinanceParameters>
	>(
		(flow: Parameters<typeof extractBinanceParameters>[1]) =>
			extractBinanceParameters(symbols, flow),
		[
			{
				input: {
					nodes: [
						{
							id: "n1",
							text: JSON.stringify(intervalKey),
							x: 0,
							y: 0,
							outs: [{ id: "o1" }]
						},
						{
							id: "n2",
							text: intervalValue,
							x: 0,
							y: 0,
							outs: [{ id: "o1" }]
						},
						{
							id: "n3",
							text: IntervalParameter.kind,
							x: 0,
							y: 0,
							ins: [{ id: "i1" }, { id: "i2" }],
							outs: [{ id: "o1" }]
						}
					],
					edges: [
						{ id: "e1", from: ["n1", "o1"], to: ["n3", "i1"] },
						{ id: "e2", from: ["n2", "o1"], to: ["n3", "i2"] }
					]
				},
				output: [
					{
						kind: IntervalParameter.kind,
						key: intervalKey,
						defaultValue: intervalValue
					}
				]
			},
			{
				input: {
					nodes: [
						{
							id: "n1",
							text: JSON.stringify(symbolKey),
							x: 0,
							y: 0,
							outs: [{ id: "o1" }]
						},
						{
							id: "n2",
							text: symbolValue,
							x: 0,
							y: 0,
							outs: [{ id: "o1" }]
						},
						{
							id: "n3",
							text: SymbolParameter.kind,
							x: 0,
							y: 0,
							ins: [{ id: "i1" }, { id: "i2" }],
							outs: [{ id: "o1" }]
						}
					],
					edges: [
						{ id: "e1", from: ["n1", "o1"], to: ["n3", "i1"] },
						{ id: "e2", from: ["n2", "o1"], to: ["n3", "i2"] }
					]
				},
				output: [
					{
						kind: SymbolParameter.kind,
						key: symbolKey,
						defaultValue: symbolValue
					}
				]
			}
		]
	)
})

test("extractBinanceSymbolsAndIntervalsFromFlowCandles", async () => {
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

			// TODO
			// It handles nodes `symbolParameter` and `intervalParameter`.
			// {
			// 	input: {
			// 		nodes: [
			// 			{
			// 				id: "tdfzs",
			// 				text: "BTC/USDT",
			// 				outs: [
			// 					{
			// 						id: "o0"
			// 					}
			// 				],
			// 				x: 76,
			// 				y: 20
			// 			},
			// 			{
			// 				id: "qjjzi",
			// 				text: "symbolParameter",
			// 				ins: [
			// 					{
			// 						id: "i0"
			// 					},
			// 					{
			// 						id: "i1"
			// 					}
			// 				],
			// 				outs: [
			// 					{
			// 						id: "o0"
			// 					}
			// 				],
			// 				x: 200,
			// 				y: 131
			// 			},
			// 			{
			// 				id: "ipbud",
			// 				text: '"symbol"',
			// 				outs: [
			// 					{
			// 						id: "o"
			// 					}
			// 				],
			// 				x: 224,
			// 				y: 45
			// 			},
			// 			{
			// 				id: "yechx",
			// 				text: "candles",
			// 				ins: [
			// 					{
			// 						id: "i0"
			// 					},
			// 					{
			// 						id: "i1"
			// 					},
			// 					{
			// 						id: "i2"
			// 					}
			// 				],
			// 				outs: [
			// 					{
			// 						id: "o0"
			// 					},
			// 					{
			// 						id: "o1"
			// 					},
			// 					{
			// 						id: "o2"
			// 					},
			// 					{
			// 						id: "o3"
			// 					},
			// 					{
			// 						id: "o4"
			// 					}
			// 				],
			// 				x: 333,
			// 				y: 253
			// 			},
			// 			{
			// 				id: "bggtp",
			// 				text: "1h",
			// 				outs: [
			// 					{
			// 						id: "o0"
			// 					}
			// 				],
			// 				x: 579,
			// 				y: 13
			// 			},
			// 			{
			// 				id: "gsgay",
			// 				text: "25",
			// 				outs: [
			// 					{
			// 						id: "o"
			// 					}
			// 				],
			// 				x: 518,
			// 				y: 182
			// 			},
			// 			{
			// 				id: "sbrls",
			// 				text: "intervalParameter",
			// 				ins: [
			// 					{
			// 						id: "i0"
			// 					},
			// 					{
			// 						id: "i1"
			// 					}
			// 				],
			// 				outs: [
			// 					{
			// 						id: "o0"
			// 					}
			// 				],
			// 				x: 450,
			// 				y: 111
			// 			},
			// 			{
			// 				id: "afxnr",
			// 				text: '"interval"',
			// 				outs: [
			// 					{
			// 						id: "o"
			// 					}
			// 				],
			// 				x: 407,
			// 				y: 28
			// 			}
			// 		],
			// 		edges: [
			// 			{
			// 				id: "ptgcj",
			// 				from: ["ipbud", "o"],
			// 				to: ["qjjzi", "i0"]
			// 			},
			// 			{
			// 				id: "kvowc",
			// 				from: ["tdfzs", "o0"],
			// 				to: ["qjjzi", "i1"]
			// 			},
			// 			{
			// 				id: "kpmdj",
			// 				from: ["qjjzi", "o0"],
			// 				to: ["yechx", "i0"]
			// 			},
			// 			{
			// 				id: "jhzjd",
			// 				from: ["bggtp", "o0"],
			// 				to: ["sbrls", "i1"]
			// 			},
			// 			{
			// 				id: "jshro",
			// 				from: ["sbrls", "o0"],
			// 				to: ["yechx", "i1"]
			// 			},
			// 			{
			// 				id: "lfond",
			// 				from: ["gsgay", "o"],
			// 				to: ["yechx", "i2"]
			// 			},
			// 			{
			// 				id: "hpzag",
			// 				from: ["afxnr", "o"],
			// 				to: ["sbrls", "i0"]
			// 			}
			// 		]
			// 	},
			// 	output: [{ symbol: "BTCUSDT", interval: "1h" }]
			// }
		]
	)
})

test("extractsBinanceSymbolsFromTickerPriceAndOrderNodes", async () => {
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
