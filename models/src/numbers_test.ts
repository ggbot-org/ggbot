import { describe, test } from "node:test"

import { assertEqual } from "./assertions.js"
import { isFiniteNumber, isNaturalNumber } from "./numbers.js"

const notAllowed = [NaN, Infinity]

describe("isFiniteNumber", () => {
	test("validates FiniteNumber", () => {
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
})

describe("isNaturalNumber", () => {
	test("validates NaturalNumber", () => {
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
})
