import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { ErrorInvalidArg } from "./errors.js"
import { isName, normalizeName, throwIfInvalidName } from "./name.js"

const nameTooLong = "x".repeat(999)
export const invalidNames = ["", "     ", nameTooLong]

describe("isName", () => {
	it("validates string as name or throws", () => {
		[
			{ input: "valid name", output: true },
			...invalidNames
				.map(normalizeName)
				.map((input) => ({ input, output: false }))
		].forEach(({ input, output }) => {
			assert.equal(isName(input), output)
		})
	})
})

describe("throwIfInvalidName", () => {
	it("throws ErrorInvalidArg", () => {
		[...invalidNames.map(normalizeName)].forEach((value) => {
			assert.throws(
				() => {
					throwIfInvalidName(value)
				},
				{ name: "Error", message: ErrorInvalidArg.message("Name") }
			)
		})
	})
})
