import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { typicalPrice } from "./typicalPrice.js"

void describe("Typical Price", () => {
	void test("works", () => {
		[
			{ input: { high: 0, low: 0, close: 0 }, output: 0 },
			{ input: { high: 10, low: 20, close: 30 }, output: 20 },
			{ input: { high: 10.12, low: 10.23, close: 10.34 }, output: 10.23 }
		].forEach(({ input: { high, low, close }, output }) => {
			assert.deepEqual(typicalPrice(high, low, close), output)
		})
	})
})
