import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import {
	isFiniteString,
	isIdentifierString,
	isNonEmptyString,
	stringMaxLength,
} from './strings.js'

const fooString = 'foo'
const stringTooLong = 'x'.repeat(999)
const emptyString = ''
const stringWithLineBreaks = `
hello
world
`
export const invalidIdentifierStrings = [
	emptyString,
	stringTooLong,
	stringWithLineBreaks,
]

test('isFiniteString', () => {
	assert.ok(stringTooLong.length > stringMaxLength)

	type TestData = Array<{
		input: unknown
		output: boolean
	}>
	const testData: TestData = [
		{ input: fooString, output: true },
		{ input: stringWithLineBreaks, output: true },
		{ input: emptyString, output: true },
		{ input: stringTooLong, output: false },
	]

	for (const { input, output } of testData) {
		assert.equal(isFiniteString(input), output)
	}
})

test('isNonEmptyString', () => {
	type TestData = Array<{
		input: unknown
		output: boolean
	}>
	const testData: TestData = [
		{ input: fooString, output: true },
		{ input: stringWithLineBreaks, output: true },
		{ input: emptyString, output: false },
		{ input: stringTooLong, output: false },
	]

	for (const { input, output } of testData) {
		assert.equal(isNonEmptyString(input), output)
	}
})

test('isIdentifierString', () => {
	type TestData = Array<{
		input: unknown
		output: boolean
	}>
	const testData: TestData = [
		{ input: fooString, output: true },
		...invalidIdentifierStrings.map((input) => ({
			input,
			output: false,
		})),
	]

	for (const { input, output } of testData) {
		assert.equal(isIdentifierString(input), output)
	}
})
