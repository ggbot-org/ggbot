import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { coerceToTimeUnit, isTimeUnit } from "./units.js"

describe("coerceToTimeUnit", () => {
	it("works", () => {
		;[
			{ input: "not a TimeUnit", output: undefined },
			{ input: "seconds", output: "second" },
			{ input: "1s", output: "second" },
			{ input: "minutes", output: "minute" },
			{ input: "1m", output: "minute" },
			{ input: "hours", output: "hour" },
			{ input: "1h", output: "hour" },
			{ input: "days", output: "day" },
			{ input: "1d", output: "day" }
		].forEach(({ input, output }) => {
			assert.equal(coerceToTimeUnit(input), output)
		})
	})
})

describe("isTimeUnit", () => {
	it("is TimeUnit type guard", () => {
		;[
			{ input: "not a TimeUnit", output: false },
			{ input: "second", output: true },
			{ input: "minute", output: true },
			{ input: "hour", output: true },
			{ input: "day", output: true }
		].forEach(({ input, output }) => {
			assert.equal(isTimeUnit(input), output)
		})
	})
})
