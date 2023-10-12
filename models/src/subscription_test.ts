import { describe, test } from "node:test"

import { assertEqual } from "./assertions.js"
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
