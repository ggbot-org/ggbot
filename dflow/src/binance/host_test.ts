import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { now, truncateTime } from 'minimal-time-helpers'

import { DflowBinanceHost } from './host.js'
import { DflowBinanceClientMock } from './mocks/client.js'
import { getDflowBinanceNodesCatalog } from './nodesCatalog.js'

describe('DflowBinanceHost', () => {
	describe('load()', () => {
		test('parses a flow view and loads it into a Dflow graph', async () => {
			const binance = new DflowBinanceClientMock()
			const { symbols } = await binance.exchangeInfo()
			const nodesCatalog = getDflowBinanceNodesCatalog(symbols)
			const dflow = new DflowBinanceHost(
				{ nodesCatalog },
				{
					binance,
					defaults: {},
					params: {},
					memory: {},
					time: truncateTime(now()).to.minute,
				}
			)
			dflow.load({
				edges: [],
				nodes: [
					{
						id: 'a',
						text: 'BTC/BUSD',
					},
				],
			})
			assert.ok(dflow.getNodeById('a') !== undefined)
		})
	})
})
