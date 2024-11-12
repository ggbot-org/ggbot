import { test } from 'node:test'

import { assertEqual } from 'minimal-assertion-helpers'

import { isYearlyPurchase } from './subscriptionPurchase.js'

test('isYearlyPurchase', () => {
	assertEqual<
		Parameters<typeof isYearlyPurchase>[0],
		ReturnType<typeof isYearlyPurchase>
	>(isYearlyPurchase, [
		{
			input: {
				numMonths: 'any'
			},
			output: undefined
		},
		{
			input: {
				numMonths: 1
			},
			output: false
		},
		{
			input: {
				// 11 months is a yearly subscription, considering 1 month discount.
				numMonths: 11
			},
			output: true
		}
	])
})
