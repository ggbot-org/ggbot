import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { assertEqual } from "./assertions.js"
import { ErrorInvalidArg } from "./errors.js"
import { isName, normalizeName, throwIfInvalidName } from "./name.js"

const nameTooLong = "x".repeat(999)
export const invalidNames = ["", "     ", nameTooLong]

describe("isName", () => {
	test("validates string as name or throws", () => {
		assertEqual<string, boolean>(isName, [
			{ input: "valid name", output: true },
			...invalidNames.map((input) => ({ input, output: false }))
		])
	})
})

// TODO assertThrows
describe("throwIfInvalidName", () => {
	test("throws ErrorInvalidArg", () => {
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
