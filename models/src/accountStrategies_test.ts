import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { accountStrategiesModifier } from "./accountStrategies.js"
import { AccountStrategy } from "./accountStrategy.js"
import { ErrorExceededQuota } from "./errors.js"
import { newId } from "./item.js"

const accountStrategy1: AccountStrategy = {
	strategyId: "11111111",
	strategyKind: "binance",
	name: "name 1",
	schedulings: []
}

const accountStrategy2: AccountStrategy = {
	strategyId: "22222222",
	strategyKind: "binance",
	name: "name 2",
	schedulings: []
}

const accountStrategy3: AccountStrategy = {
	strategyId: "33333333",
	strategyKind: "binance",
	name: "name 3",
	schedulings: []
}

const accountStrategy4: AccountStrategy = {
	strategyId: "44444444",
	strategyKind: "binance",
	name: "name 4",
	schedulings: [
		{
			id: newId(),
			frequency: { every: 2, interval: "1h" },
			status: "active"
		}
	]
}

void describe("accountStrategiesModifier", () => {
	void describe("insertItem", () => {
		void test("inserts a new item", () => {
			assertDeepEqual<
				Parameters<typeof accountStrategiesModifier.insertItem>,
				ReturnType<typeof accountStrategiesModifier.insertItem>
			>(
				function insertItem(
					input: Parameters<
						typeof accountStrategiesModifier.insertItem
					>
				) {
					return accountStrategiesModifier.insertItem(...input)
				},
				[
					{
						input: [[], accountStrategy1, undefined],
						output: [accountStrategy1]
					}
				]
			)
		})

		void test("throws ErrorExceededQuota with MAX_STRATEGIES_PER_ACCOUNT", () => {
			assert.throws(
				() => {
					accountStrategiesModifier.insertItem(
						[accountStrategy1, accountStrategy2],
						accountStrategy3,
						undefined
					)
				},
				{
					name: "Error",
					message: ErrorExceededQuota.message(
						"MAX_STRATEGIES_PER_ACCOUNT"
					)
				}
			)
		})

		void test("throws ErrorExceededQuota with MAX_SCHEDULINGS_PER_ACCOUNT", () => {
			assert.throws(
				() => {
					accountStrategiesModifier.insertItem(
						[],
						accountStrategy4,
						undefined
					)
				},
				{
					name: "Error",
					message: ErrorExceededQuota.message(
						"MAX_SCHEDULINGS_PER_ACCOUNT"
					)
				}
			)
		})
	})
})
