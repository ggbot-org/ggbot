import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { isTime, now } from "./time.js"

describe("isTime", () => {
	it("validates input if is valid Time", () => {
		;[
			{ input: "not a time", output: false },
			{ input: "123456789", output: false },
			{ input: "2022-07-23T11:43:05.841Z", output: false },
			{ input: -1, output: false },
			{ input: 1.5, output: false },
			{ input: Infinity, output: false },
			{ input: NaN, output: false },
			{ input: 999999, output: true },
			{ input: now(), output: true }
		].forEach(({ input, output }) => {
			assert.equal(isTime(input), output)
		})
	})
})
