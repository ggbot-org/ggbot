import { strict as assert } from "node:assert"
import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import {
	isFiniteString,
	isIdentifierString,
	isNonEmptyString,
	stringMaxLength
} from "./strings.js"

const fooString = "foo"
const stringTooLong = "x".repeat(999)
const emptyString = ""
const stringWithLineBreaks = `
hello
world
`
export const invalidIdentifierStrings = [
	emptyString,
	stringTooLong,
	stringWithLineBreaks
]

void test("isFiniteString", () => {
	assert.ok(stringTooLong.length > stringMaxLength)

	assertEqual<unknown, boolean>(isFiniteString, [
		{ input: fooString, output: true },
		{ input: stringWithLineBreaks, output: true },
		{ input: emptyString, output: true },
		{ input: stringTooLong, output: false }
	])
})

void test("isNonEmptyString", () => {
	assertEqual<unknown, boolean>(isNonEmptyString, [
		{ input: fooString, output: true },
		{ input: stringWithLineBreaks, output: true },
		{ input: emptyString, output: false },
		{ input: stringTooLong, output: false }
	])
})

void test("isIdentifierString", () => {
	assertEqual<unknown, boolean>(isIdentifierString, [
		{ input: fooString, output: true },
		...invalidIdentifierStrings.map((key) => ({
			input: { [key]: "value" },
			output: false
		}))
	])
})
