import { test } from 'node:test'

import { assertEqual } from 'minimal-assertion-helpers'
import { getDay, today } from 'minimal-time-helpers'

import { isSubscription, numDaysSubscriptionExpirationTolerance, statusOfSubscription, Subscription, SubscriptionStatus } from './subscription.js'

test('isSubscription', () => {
	assertEqual<Subscription, boolean>(isSubscription, [
		{
			input: {
				plan: 'basic',
				end: '2022-01-01'
			},
			output: true
		}
	])
})

test('statusOfSubscription', () => {
	assertEqual<Pick<Subscription, 'end'>, SubscriptionStatus>(
		statusOfSubscription,
		[
			{
				input: {
					end: '2000-01-01'
				},
				output: 'expired'
			},
			{
				input: {
					end: today()
				},
				output: 'active'
			},
			// If subscription ended few days ago, according to expiration tolerance, it's still active.
			{
				input: {
					end: getDay(today()).minus(
						numDaysSubscriptionExpirationTolerance - 1
					).days
				},
				output: 'active'
			},
			// If subscription ended `numDaysSubscriptionExpirationTolerance + 1` days ago, it's expired.
			{
				input: {
					end: getDay(today()).minus(
						numDaysSubscriptionExpirationTolerance + 1
					).days
				},
				output: 'expired'
			}
		]
	)
})
