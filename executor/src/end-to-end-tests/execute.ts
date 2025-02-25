import {
	DflowBinanceExecutor,
	getDflowBinanceNodesCatalog,
} from '@workspace/dflow'
import { StrategyFlow } from '@workspace/models'
import { now, truncateTime } from 'minimal-time-helpers'

import { Binance } from '../binance.js'

const accountId = process.env.ACCOUNT_ID
if (!accountId) throw new Error('Set ACCOUNT_ID environment variable')

const binance = new Binance(accountId)
const x = 0,
	y = 0

const strategyFlow: StrategyFlow = {
	view: {
		nodes: [
			{
				id: 'n1',
				text: 'BTC/USDC',
				outs: [{ id: 'o0' }],
				x,
				y,
			},
			{
				id: 'n2',
				text: '0.001',
				outs: [{ id: 'o0' }],
				x,
				y,
			},
			{
				id: 'n3',
				text: 'true',
				outs: [{ id: 'o0' }],
				x,
				y,
			},
			{
				id: 'n4',
				text: 'buyMarket',
				ins: [{ id: 'i0' }, { id: 'i1' }, { id: 'i2' }, { id: 'i3' }],
				outs: [{ id: 'o0' }],
				x,
				y,
			},
		],
		edges: [
			{ id: 'e1', from: ['n1', 'o0'], to: ['n4', 'i0'] },
			{ id: 'e2', from: ['n2', 'o0'], to: ['n4', 'i1'] },
			{ id: 'e3', from: ['n3', 'o0'], to: ['n4', 'i3'] },
		],
	},
	whenUpdated: 0,
}
const { view } = strategyFlow

const time = truncateTime(now()).to.minute

const { symbols } = await binance.exchangeInfo()
const nodesCatalog = getDflowBinanceNodesCatalog(symbols)

const executor = new DflowBinanceExecutor()
executor.nodesCatalog = nodesCatalog

const { orders } = await executor.run(
	{ binance, params: {}, memory: {}, time },
	view
)

console.info('orders', orders)
