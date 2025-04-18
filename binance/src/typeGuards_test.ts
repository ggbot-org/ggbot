import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import {
	isBinanceKline,
	isBinanceKlineInterval,
	isBinanceSymbolFilterLotSize,
	isBinanceSymbolFilterMinNotional,
} from './typeGuards.js'

test('isBinanceKline', () => {
	for (const { input, output } of [
		{
			input: [
				1674259200000,
				'0.07316200',
				'0.07390800',
				'0.07115000',
				'0.07140000',
				'66387.19950000',
				1674345599999,
				'4790.90937830',
				120641,
				'29534.47870000',
				'2131.84019322',
				'0',
			],
			output: true,
		},
	]) {
		assert.equal(isBinanceKline(input), output)
	}
})

test('isBinanceKlineInterval', () => {
	for (const { input, output } of [
		{ input: 'xx', output: false },
		{ input: '1m', output: true },
		{ input: '3m', output: true },
		{ input: '5m', output: true },
		{ input: '15m', output: true },
		{ input: '30m', output: true },
		{ input: '1h', output: true },
		{ input: '2h', output: true },
		{ input: '4h', output: true },
		{ input: '6h', output: true },
		{ input: '8h', output: true },
		{ input: '12h', output: true },
		{ input: '1d', output: true },
		{ input: '3d', output: true },
		{ input: '1w', output: true },
		{ input: '1M', output: true },
	]) {
		assert.equal(isBinanceKlineInterval(input), output)
	}
})

test('isBinanceSymbolFilterLotSize', () => {
	for (const { input, output } of [
		{
			input: {
				filterType: 'LOT_SIZE',
				minQty: '0.00010000',
				maxQty: '100000.00000000',
				stepSize: '0.00010000',
			},
			output: true,
		},
		{
			input: {
				filterType: 'XXX',
				minQty: '0.00010000',
				maxQty: '100000.00000000',
				stepSize: '0.00010000',
			},
			output: false,
		},
		{
			input: {
				filterType: 'LOT_SIZE',
				minQty: 'not a number',
				maxQty: '100000.00000000',
				stepSize: '0.00010000',
			},
			output: false,
		},
		{
			input: {
				filterType: 'LOT_SIZE',
				minQty: '0.00010000',
				maxQty: 'not a number',
				stepSize: '0.00010000',
			},
			output: false,
		},
		{
			input: {
				filterType: 'LOT_SIZE',
				minQty: '0.00010000',
				maxQty: '100000.00000000',
				stepSize: 'not a number',
			},
			output: false,
		},
	]) {
		assert.equal(isBinanceSymbolFilterLotSize(input), output)
	}
})

test('isBinanceSymbolFilterMinNotional', () => {
	for (const { input, output } of [
		{
			input: {
				filterType: 'MIN_NOTIONAL',
				minNotional: '0.00010000',
				applyToMarket: true,
				avgPriceMins: 5,
			},
			output: true,
		},
		{
			input: {
				filterType: 'XXX',
				minNotional: '0.00010000',
				applyToMarket: true,
				avgPriceMins: 5,
			},
			output: false,
		},
		{
			input: {
				filterType: 'MIN_NOTIONAL',
				minNotional: 'not a number',
				applyToMarket: true,
				avgPriceMins: 5,
			},
			output: false,
		},
		{
			input: {
				filterType: 'MIN_NOTIONAL',
				minNotional: '0.00010000',
				applyToMarket: 'not a boolean',
				avgPriceMins: 5,
			},
			output: false,
		},
		{
			input: {
				filterType: 'MIN_NOTIONAL',
				minNotional: '0.00010000',
				applyToMarket: true,
				avgPriceMins: 'not a number',
			},
			output: false,
		},
	]) {
		assert.equal(isBinanceSymbolFilterMinNotional(input), output)
	}
})
