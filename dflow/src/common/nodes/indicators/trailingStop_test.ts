import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { trailingStop } from "./trailingStop.js"

describe("Trailing Stop", () => {
	test("works", () => {
		[
			{
				input: { stopPrice: undefined },
				output: { stopPrice: undefined }
			}
		].forEach(({ input, output }) => {
			assert.deepEqual(trailingStop(input), output)
		})
	})
})
