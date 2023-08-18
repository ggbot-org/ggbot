import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { dateToDay, dayToDate, getDate, today } from "minimal-time-helpers"

import { nullId } from "./item.js"
import {
	isSubscriptionPurchase,
	newMonthlySubscription,
	newYearlySubscription
} from "./subscriptionPurchase.js"
import { createdNow } from "./time.js"

describe("isSubscriptionPurchase", () => {
	it("validates SubscriptionPurchase", () => {
		const paymentProvider = "utrust"
		const plan = "basic"
		const startDay = today()
		const startDate = dayToDate(startDay)
		const numMonths = 3
		const endDate = getDate(startDate).plus(numMonths).months
		const endDay = dateToDay(endDate)
		const dayInterval = { start: startDay, end: endDay }
		const { whenCreated } = createdNow()

		;[
			{
				input: newMonthlySubscription({
					numMonths: 2,
					paymentProvider,
					plan,
					startDay
				}),
				output: true
			},
			{
				input: newYearlySubscription({
					plan,
					paymentProvider,
					startDay
				}),
				output: true
			},
			{
				input: {
					id: nullId,
					paymentProvider,
					plan,
					status: "completed",
					whenCreated,
					...dayInterval
				},
				output: true
			},
			{
				input: {
					id: nullId,
					info: {
						uuid: "xxx"
					},
					paymentProvider,
					plan,
					status: "completed",
					whenCreated,
					...dayInterval
				},
				output: true
			},
			{
				input: {
					id: nullId,
					info: "not an object",
					paymentProvider,
					plan,
					status: "completed",
					whenCreated,
					...dayInterval
				},
				output: false
			},
			{
				input: {
					id: nullId,
					paymentProvider,
					plan: "not an plan",
					status: "completed",
					whenCreated,
					...dayInterval
				},
				output: false
			},
			{
				input: {
					id: nullId,
					paymentProvider,
					plan,
					status: "not a status",
					whenCreated,
					...dayInterval
				},
				output: false
			},
			{
				input: {
					id: nullId,
					paymentProvider,
					plan,
					status: "completed",
					whenCreated: "not a timestamp",
					...dayInterval
				},
				output: false
			},
			{
				input: {
					id: nullId,
					paymentProvider: "not a paymentProvider",
					plan,
					status: "completed",
					whenCreated,
					...dayInterval
				},
				output: false
			}
		].forEach(({ input, output }) => {
			assert.equal(
				isSubscriptionPurchase(input),
				output,
				`isSubscriptionPurchase(${JSON.stringify(input)}) !== ${output}`
			)
		})
	})
})
