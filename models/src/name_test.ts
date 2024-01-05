import { strict as assert } from "node:assert"
import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { ErrorInvalidArg } from "./errors.js"
import { isName, normalizeName, throwIfInvalidName } from "./name.js"

const nameTooLong = "x".repeat(999)
export const invalidNames = ["", "     ", nameTooLong]

void test("isName", () => {
	assertEqual<string, boolean>(isName, [
		{ input: "valid name", output: true },
		...invalidNames.map((input) => ({ input, output: false }))
	])
})

// TODO assertThrows
void test("throwIfInvalidName", () => {
	[...invalidNames.map(normalizeName)].forEach((value) => {
		assert.throws(
			() => {
				throwIfInvalidName(value)
			},
			{ name: "Error", message: ErrorInvalidArg.message("Name") }
		)
	})
})
