import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { isItemId } from "./item.js"

describe("isItemId", () => {
	test("validates id as UUID", () => {
		[
			{ input: undefined, output: false },
			{ input: 1000, output: false },
			{ input: "", output: false },
			{ input: "12345678", output: true }
		].forEach(({ input, output }) => {
			assert.equal(isItemId(input), output)
		})
	})
})
