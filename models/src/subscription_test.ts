import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { getDay, today } from 'minimal-time-helpers'

import { isSubscription,
	numDaysSubscriptionExpirationTolerance,
	statusOfSubscription,
	Subscription,
	SubscriptionStatus } from './subscription.js'

test('isSubscription', () => {
	type TestData = Array<{
		input: Subscription;
		output: boolean;
	}>
	const testData: TestData = [
		{
			input: {
				plan: 'basic',
				end: '2022-01-01',
			},
			output: true,
		},
	]

	for (const { input, output } of testData) {
		assert.equal(isSubscription(input), output)
	}
})

test('statusOfSubscription', () => {
	type TestData = Array<{
		input: Pick<Subscription, 'end'>;
		output: SubscriptionStatus;
	}>
	const testData: TestData = [
		{
			input: {
				end: '2000-01-01',
			},
			output: 'expired',
		},
		{
			input: {
				end: today(),
			},
			output: 'active',
		},
		// If subscription ended few days ago, according to expiration tolerance, it's still active.
		{
			input: {
				end: getDay(today()).minus(numDaysSubscriptionExpirationTolerance - 1).days,
			},
			output: 'active',
		},
		// If subscription ended `numDaysSubscriptionExpirationTolerance + 1` days ago, it's expired.
		{
			input: {
				end: getDay(today()).minus(numDaysSubscriptionExpirationTolerance + 1).days,
			},
			output: 'expired',
		},
	]

	for (const { input, output } of testData) {
		assert.equal(statusOfSubscription(input), output)
	}
})
