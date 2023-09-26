import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { isSubscription } from "./subscription.js"

describe("isSubscription", () => {
	test("validates Subscription", () => {
		[
			{
				input: {
					plan: "basic",
					end: "2022-01-01"
				},
				output: true
			}
		].forEach(({ input, output }) => {
			assert.equal(
				isSubscription(input),
				output,
				`isSubscription(${JSON.stringify(input)}) !== ${output}`
			)
		})
	})
})
