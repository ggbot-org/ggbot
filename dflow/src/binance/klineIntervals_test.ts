import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { DflowBinanceKlineInterval, dflowBinanceKlineIntervals } from './klineIntervals.js'

type TestInterval = { interval: DflowBinanceKlineInterval }
const sortIntervals = (values: TestInterval[]) => values.slice().sort(
	(a, b) => dflowBinanceKlineIntervals.indexOf(a.interval) - dflowBinanceKlineIntervals.indexOf(b.interval)
)

describe('dflowBinanceKlineIntervals', () => {
	test('can be used to sort intervals', () => {
		type TestData = Array<{
			input: TestInterval[]
			output: TestInterval[]
		}>
		const testData: TestData = [
			{
				input: [{ interval: '1d' }, { interval: '1h' }],
				output: [{ interval: '1h' }, { interval: '1d' }]
			}
		]

		for (const { input, output } of testData) {
			assert.deepEqual(sortIntervals(input), output)
		}
	})
})
