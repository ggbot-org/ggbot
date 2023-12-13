import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { quota } from "./quotas.js"
import { SubscriptionPlan } from "./subscription.js"

void describe("quota", () => {
	void test("MAX_SCHEDULINGS_PER_ACCOUNT", () => {
		assertEqual<SubscriptionPlan | undefined, number>(
			quota.MAX_SCHEDULINGS_PER_ACCOUNT,
			[
				{
					input: undefined,
					output: 0
				},
				{
					input: "basic",
					output: 10
				},
				{
					input: "pro",
					output: 30
				}
			]
		)
	})

	void test("MAX_STRATEGIES_PER_ACCOUNT", () => {
		assertEqual<SubscriptionPlan | undefined, number>(
			quota.MAX_STRATEGIES_PER_ACCOUNT,
			[
				{
					input: undefined,
					output: 2
				},
				{
					input: "basic",
					output: 20
				},
				{
					input: "pro",
					output: 50
				}
			]
		)
	})
})
