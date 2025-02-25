import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isYearlyPurchase } from './subscriptionPurchase.js'

test('isYearlyPurchase', () => {
	for (const { input, output } of [
		{
			input: { numMonths: 'any' },
			output: undefined,
		},
		{
			input: { numMonths: 1 },
			output: false,
		},
		{
			input: {
				// 11 months is a yearly subscription, considering 1 month discount.
				numMonths: 11,
			},
			output: true,
		},
	]) {
		assert.equal(isYearlyPurchase(input), output)
	}
})
