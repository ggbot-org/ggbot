import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { normalizeName } from "./name.js"
import { invalidNames } from "./name_test.js"
import { isStrategy, newStrategy } from "./strategy.js"
import { createdNow } from "./time.js"

describe("isStrategy", () => {
	test("validates Strategy", () => {
		const accountId = "00000000"
		const kind = "binance"
		const name = "Name"
		const { whenCreated } = createdNow()
		;[
			{
				input: newStrategy({ accountId, kind, name }),
				output: true
			},
			{
				input: {
					accountId,
					id: "not an id",
					kind,
					name,
					whenCreated
				},
				output: false
			},
			{
				input: {
					accountId,
					id: "00000000",
					whenCreated: "not a timestamp"
				},
				output: false
			},
			...invalidNames.map((invalidName) => ({
				input: {
					accountId,
					id: "00000000",
					kind,
					name: normalizeName(invalidName),
					whenCreated
				},
				output: false
			}))
		].forEach(({ input, output }) => {
			assert.equal(
				isStrategy(input),
				output,
				`isStrategy(${JSON.stringify(input)}) !== ${output}`
			)
		})
	})
})
