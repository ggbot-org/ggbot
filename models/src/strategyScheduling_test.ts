import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { nullId } from './item.js'
import { isStrategyScheduling } from './strategyScheduling.js'

test('isStrategyScheduling', () => {
	for (const { input, output } of [
		{
			input: {
				id: nullId,
				status: 'active',
				frequency: { every: 1, interval: '1h' },
			},
			output: true,
		},
		{
			input: {
				id: nullId,
				status: 'active',
				frequency: { every: 1, interval: '1h' },
				params: { 'param 1': 123 },
			},
			output: true,
		},
		{
			input: {
				id: nullId,
				status: 'active',
				frequency: { every: 1, interval: '1h' },
				memory: { 'label 1': 123 },
			},
			output: true,
		},
	]) {
		assert.equal(isStrategyScheduling(input), output)
	}
})
