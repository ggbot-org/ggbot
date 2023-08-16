import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { isTimestamp } from "./timestamp.js"

describe("isTimestamp", () => {
	it("validates input if is valid Timestamp", () => {
		;[
			{ input: "not a date", output: false },
			{ input: "2000-01-01", output: false },
			{ input: "2022-07-23T11:43:05.841Z", output: true }
		].forEach(({ input, output }) => {
			assert.equal(isTimestamp(input), output)
		})
	})
})
