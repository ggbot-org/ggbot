import { orderBuyBTCBUSD1 } from './orders.js'

/** @type {import('dflow').DflowExecutionReport['steps']} */
export const executionStepsBuyBTCUSD = [
	{
		id: 'jxhrh',
		k: 'data',
		o: [{ id: 'o', d: 20 }]
	},
	{
		id: 'qqpmg',
		// LOL: BUSD is delisted now.
		k: 'BTC/BUSD',
		o: [{ id: 'o0', d: 'BTCBUSD' }]
	},
	{
		id: 'pgzne',
		k: 'buyMarket',
		o: [{ id: 'o0', d: orderBuyBTCBUSD1 }]
	}
]
