import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { DefaultSymbol } from '../common/nodes/defaults.js'
import {
	extractBinanceParametersFromFlow,
	extractBinanceSymbolsAndIntervalsFromFlow,
	extractsBinanceDefaultsFromFlow,
	extractsBinanceSymbolsFromFlow,
} from './flow.js'
import { DflowBinanceClientMock } from './mocks/client.js'
import { Candles, TickerPrice } from './nodes/market.js'
import { IntervalParameter, SymbolParameter } from './nodes/parameters.js'
import { BuyMarket, SellMarket } from './nodes/trade.js'
import { getDflowBinanceNodesCatalog } from './nodesCatalog.js'
import { getDflowBinanceNodeSymbolKind } from './symbols.js'

test('extractBinanceParametersFromFlow', async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()
	const intervalValue = '1h'
	const intervalKey = 'my interval'
	const symbolBaseAsset = 'BTC'
	const symbolQuoteAsset = 'BUSD'
	const symbolKey = 'my symbol'

	assert.deepEqual(
		await extractBinanceParametersFromFlow(symbols, {
			nodes: [
				{
					id: 'n1',
					text: JSON.stringify(intervalKey),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n2',
					text: intervalValue,
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n3',
					text: IntervalParameter.kind,
					ins: [{ id: 'i1' }, { id: 'i2' }],
					outs: [{ id: 'o1' }],
				},
			],
			edges: [
				{ id: 'e1', from: ['n1', 'o1'], to: ['n3', 'i1'] },
				{ id: 'e2', from: ['n2', 'o1'], to: ['n3', 'i2'] },
			],
		}),
		[
			{
				kind: IntervalParameter.kind,
				key: intervalKey,
				defaultValue: intervalValue,
			},
		]
	)

	assert.deepEqual(
		await extractBinanceParametersFromFlow(symbols, {
			nodes: [
				{
					id: 'n1',
					text: JSON.stringify(symbolKey),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n2',
					text: getDflowBinanceNodeSymbolKind({
						baseAsset: symbolBaseAsset,
						quoteAsset: symbolQuoteAsset,
					}),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n3',
					text: SymbolParameter.kind,
					ins: [{ id: 'i1' }, { id: 'i2' }],
					outs: [{ id: 'o1' }],
				},
			],
			edges: [
				{ id: 'e1', from: ['n1', 'o1'], to: ['n3', 'i1'] },
				{ id: 'e2', from: ['n2', 'o1'], to: ['n3', 'i2'] },
			],
		}),
		[
			{
				kind: SymbolParameter.kind,
				key: symbolKey,
				defaultValue: `${symbolBaseAsset}${symbolQuoteAsset}`,
			},
		]
	)
})

test('extractBinanceDefaultsFromFlow', async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()
	const symbolBaseAsset = 'BTC'
	const symbolQuoteAsset = 'BUSD'
	const nodesCatalog = getDflowBinanceNodesCatalog(symbols)

	assert.deepEqual(
		await extractsBinanceDefaultsFromFlow(nodesCatalog, {
			nodes: [
				{
					id: 'n1',
					text: getDflowBinanceNodeSymbolKind({
						baseAsset: symbolBaseAsset,
						quoteAsset: symbolQuoteAsset,
					}),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n2',
					text: DefaultSymbol.kind,
					ins: [{ id: 'i1' }],
				},
			],
			edges: [{ id: 'e1', from: ['n1', 'o1'], to: ['n2', 'i1'] }],
		}),
		{
			symbol: `${symbolBaseAsset}${symbolQuoteAsset}`,
		}
	)
})

test('extractBinanceSymbolsAndIntervalsFromFlow', async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()

	assert.deepEqual(
		await extractBinanceSymbolsAndIntervalsFromFlow(symbols, {
			nodes: [
				{ id: 'a1', text: 'ETH/BTC', outs: [{ id: 'oa1' }] },
				{ id: 'a2', text: '1h', outs: [{ id: 'oa2' }] },
				{ id: 'a3', text: '1', outs: [{ id: 'oa3' }] },
				{
					id: 'a4',
					text: Candles.kind,
					ins: [{ id: 'ai1' }, { id: 'ai2' }, { id: 'ai3' }],
				},
				{ id: 'b1', text: 'BTC/BUSD', outs: [{ id: 'ob1' }] },
				{ id: 'b2', text: '1d', outs: [{ id: 'ob2' }] },
				{ id: 'b3', text: '1', outs: [{ id: 'ob3' }] },
				{
					id: 'b4',
					text: Candles.kind,
					ins: [{ id: 'bi1' }, { id: 'bi2' }, { id: 'bi3' }],
				},
			],
			edges: [
				{ id: 'ea1', from: ['a1', 'oa1'], to: ['a4', 'ai1'] },
				{ id: 'ea2', from: ['a2', 'oa2'], to: ['a4', 'ai2'] },
				{ id: 'ea3', from: ['a3', 'oa3'], to: ['a4', 'ai3'] },
				{ id: 'eb1', from: ['b1', 'ob1'], to: ['b4', 'bi1'] },
				{ id: 'eb2', from: ['b2', 'ob2'], to: ['b4', 'bi2'] },
				{ id: 'eb3', from: ['b3', 'ob3'], to: ['b4', 'bi3'] },
			],
		}),
		[
			{ symbol: 'BTCBUSD', interval: '1d' },
			{ symbol: 'ETHBTC', interval: '1h' },
		]
	)

	// It manages duplicates.
	assert.deepEqual(
		await extractBinanceSymbolsAndIntervalsFromFlow(symbols, {
			nodes: [
				{ id: 'a1', text: 'ETH/BTC', outs: [{ id: 'oa1' }] },
				{ id: 'a2', text: '1h', outs: [{ id: 'oa2' }] },
				{ id: 'a3', text: '1', outs: [{ id: 'oa3' }] },
				{
					id: 'a4',
					text: Candles.kind,
					ins: [{ id: 'ai1' }, { id: 'ai2' }, { id: 'ai3' }],
				},
				{ id: 'b1', text: 'ETH/BTC', outs: [{ id: 'ob1' }] },
				{ id: 'b2', text: '1k', outs: [{ id: 'ob2' }] },
				{ id: 'b3', text: '1', outs: [{ id: 'ob3' }] },
				{
					id: 'b4',
					text: Candles.kind,
					ins: [{ id: 'bi1' }, { id: 'bi2' }, { id: 'bi3' }],
				},
			],
			edges: [
				{ id: 'ea1', from: ['a1', 'oa1'], to: ['a4', 'ai1'] },
				{ id: 'ea2', from: ['a2', 'oa2'], to: ['a4', 'ai2'] },
				{ id: 'ea3', from: ['a3', 'oa3'], to: ['a4', 'ai3'] },
				{ id: 'eb1', from: ['b1', 'ob1'], to: ['b4', 'bi1'] },
				{ id: 'eb2', from: ['b2', 'ob2'], to: ['b4', 'bi2'] },
				{ id: 'eb3', from: ['b3', 'ob3'], to: ['b4', 'bi3'] },
			],
		}),
		[{ symbol: 'ETHBTC', interval: '1h' }]
	)

	// It handles nodes `symbolParameter` and `intervalParameter`.
	assert.deepEqual(
		await extractBinanceSymbolsAndIntervalsFromFlow(symbols, {
			nodes: [
				{
					id: 'tdfzs',
					text: 'BTC/BUSD',
					outs: [{ id: 'o0' }],
				},
				{
					id: 'qjjzi',
					text: 'symbolParameter',
					ins: [{ id: 'i0' }, { id: 'i1' }],
					outs: [{ id: 'o0' }],
				},
				{
					id: 'ipbud',
					text: '"symbol"',
					outs: [{ id: 'o' }],
				},
				{
					id: 'yechx',
					text: 'candles',
					ins: [{ id: 'i0' }, { id: 'i1' }, { id: 'i2' }],
					outs: [
						{ id: 'o0' },
						{ id: 'o1' },
						{ id: 'o2' },
						{ id: 'o3' },
						{ id: 'o4' },
					],
				},
				{
					id: 'bggtp',
					text: '1h',
					outs: [{ id: 'o0' }],
				},
				{
					id: 'gsgay',
					text: '25',
					outs: [{ id: 'o' }],
				},
				{
					id: 'sbrls',
					text: 'intervalParameter',
					ins: [{ id: 'i0' }, { id: 'i1' }],
					outs: [{ id: 'o0' }],
				},
				{
					id: 'afxnr',
					text: '"interval"',
					outs: [{ id: 'o' }],
				},
			],
			edges: [
				{
					id: 'ptgcj',
					from: ['ipbud', 'o'],
					to: ['qjjzi', 'i0'],
				},
				{
					id: 'kvowc',
					from: ['tdfzs', 'o0'],
					to: ['qjjzi', 'i1'],
				},
				{
					id: 'kpmdj',
					from: ['qjjzi', 'o0'],
					to: ['yechx', 'i0'],
				},
				{
					id: 'jhzjd',
					from: ['bggtp', 'o0'],
					to: ['sbrls', 'i1'],
				},
				{
					id: 'jshro',
					from: ['sbrls', 'o0'],
					to: ['yechx', 'i1'],
				},
				{
					id: 'lfond',
					from: ['gsgay', 'o'],
					to: ['yechx', 'i2'],
				},
				{
					id: 'hpzag',
					from: ['afxnr', 'o'],
					to: ['sbrls', 'i0'],
				},
			],
		}),
		[{ symbol: 'BTCBUSD', interval: '1h' }]
	)
})

test('extractsBinanceSymbolsFromFlow', async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()

	assert.deepEqual(
		await extractsBinanceSymbolsFromFlow(symbols, {
			nodes: [
				{
					id: 'a1',
					text: 'ETH/BTC',
					outs: [{ id: 'oa1' }],
				},
				{ id: 'a2', text: '1', outs: [{ id: 'oa2' }] },
				{ id: 'a3', text: 'true', outs: [{ id: 'oa3' }] },
				{
					id: 'a4',
					text: BuyMarket.kind,
					ins: [{ id: 'ai1' }, { id: 'ai2' }, { id: 'ai3' }, { id: 'ai4' }],
					outs: [{ id: 'oa2' }],
				},
				{ id: 'b1', text: 'BTC/BUSD', outs: [{ id: 'ob1' }] },
				{
					id: 'b2',
					text: TickerPrice.kind,
					ins: [{ id: 'bi1' }],
					outs: [{ id: 'oa2' }],
				},
			],
			edges: [
				{ id: 'ea1', from: ['a1', 'oa1'], to: ['a4', 'ai1'] },
				{ id: 'ea2', from: ['a2', 'oa2'], to: ['a4', 'ai2'] },
				{ id: 'ea3', from: ['a3', 'oa3'], to: ['a4', 'ai4'] },
				{ id: 'eb1', from: ['b1', 'ob1'], to: ['b2', 'bi1'] },
			],
		}),
		['BTCBUSD', 'ETHBTC']
	)

	// It manages duplicates.
	assert.deepEqual(
		await extractsBinanceSymbolsFromFlow(symbols, {
			nodes: [
				{
					id: 'a1',
					text: 'ETH/BTC',
					outs: [{ id: 'oa1' }],
				},
				{ id: 'a2', text: '1', outs: [{ id: 'oa2' }] },
				{ id: 'a3', text: 'true', outs: [{ id: 'oa3' }] },
				{
					id: 'a4',
					text: SellMarket.kind,
					ins: [{ id: 'ai1' }, { id: 'ai2' }, { id: 'ai3' }, { id: 'ai4' }],
					outs: [{ id: 'oa2' }],
				},
				// Should not return "ETHBTC" twice.
				{ id: 'b1', text: 'ETH/BTC', outs: [{ id: 'ob1' }] },
				{
					id: 'b2',
					text: TickerPrice.kind,
					ins: [{ id: 'bi1' }],
					outs: [{ id: 'ob2' }],
				},
			],
			edges: [
				{ id: 'ea1', from: ['a1', 'oa1'], to: ['a4', 'ai1'] },
				{ id: 'ea2', from: ['a2', 'oa2'], to: ['a4', 'ai2'] },
				{ id: 'ea3', from: ['a3', 'oa3'], to: ['a4', 'ai4'] },
				{ id: 'eb1', from: ['b1', 'ob1'], to: ['b2', 'bi1'] },
			],
		}),
		['ETHBTC']
	)
})
