import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { isSubscription, Subscription } from "./subscription.js"

describe("isSubscription", () => {
	test("validates Subscription", () => {
		assertEqual<Subscription, boolean>(
			isSubscription,

			[
				{
					input: {
						plan: "basic",
						end: "2022-01-01"
					},
					output: true
				}
			]
		)
	})
})
