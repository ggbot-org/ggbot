import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { isFiniteNumber, isNaturalNumber } from "./numbers.js"

const notAllowed = [NaN, Infinity]

test("isFiniteNumber", () => {
	assertEqual<unknown, boolean>(isFiniteNumber, [
		{
			input: 1,
			output: true
		},
		{
			input: -1.2,
			output: true
		},
		...notAllowed.map((input) => ({ input, output: false }))
	])
})

test("isNaturalNumber", () => {
	assertEqual<unknown, boolean>(isNaturalNumber, [
		{
			input: 1,
			output: true
		},
		{
			input: 2.1,
			output: false
		},
		{
			input: -1,
			output: false
		},
		...notAllowed.map((input) => ({ input, output: false }))
	])
})
