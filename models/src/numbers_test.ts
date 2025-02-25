import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isFiniteNumber, isNaturalNumber } from './numbers.js'

const notAllowed = [NaN, Infinity]

test('isFiniteNumber', () => {
	for (const { input, output } of [
		{
			input: 1,
			output: true,
		},
		{
			input: -1.2,
			output: true,
		},
		...notAllowed.map((input) => ({ input, output: false })),
	]) {
		assert.equal(isFiniteNumber(input), output)
	}
})

test('isNaturalNumber', () => {
	for (const { input, output } of [
		{
			input: 1,
			output: true,
		},
		{
			input: 2.1,
			output: false,
		},
		{
			input: -1,
			output: false,
		},
		...notAllowed.map((input) => ({ input, output: false })),
	]) {
		assert.equal(isNaturalNumber(input), output)
	}
})
