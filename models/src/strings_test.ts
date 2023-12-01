import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

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

void describe("isFiniteString", () => {
	void test("validates FiniteString", () => {
		assert.ok(stringTooLong.length > stringMaxLength)

		assertEqual<unknown, boolean>(isFiniteString, [
			{ input: fooString, output: true },
			{ input: stringWithLineBreaks, output: true },
			{ input: emptyString, output: true },
			{ input: stringTooLong, output: false }
		])
	})
})

void describe("isNonEmptyString", () => {
	void test("validates NonEmptyString", () => {
		assertEqual<unknown, boolean>(isNonEmptyString, [
			{ input: fooString, output: true },
			{ input: stringWithLineBreaks, output: true },
			{ input: emptyString, output: false },
			{ input: stringTooLong, output: false }
		])
	})
})

void describe("isIdentifierString", () => {
	void test("validates IdentifierString", () => {
		assertEqual<unknown, boolean>(isIdentifierString, [
			{ input: fooString, output: true },
			...invalidIdentifierStrings.map((key) => ({
				input: { [key]: "value" },
				output: false
			}))
		])
	})
})
