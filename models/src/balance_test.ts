import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Balance, isBalance } from "./balance.js"

describe("isBalance", () => {
	test("validates Balance", () => {
		const testData: Balance[] = [
			{
				asset: "BUSD",
				free: "-1000.00",
				locked: "0"
			}
		]
		testData.forEach((balance) => {
			assert.ok(isBalance(balance))
		})
	})
})
