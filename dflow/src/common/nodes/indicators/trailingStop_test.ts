import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import {
	trailingStop,
	TrailingStopInput,
	TrailingStopOutput
} from "./trailingStop.js"

describe("Trailing Stop", () => {
	test("works", () => {
		const testData: {
			input: TrailingStopInput
			output: TrailingStopOutput
		}[] = [
			// If `direction` is "UP" and `marketPrice` is below `stopPrice`, then `exitTrailing` is true.
			{
				input: {
					direction: "UP",
					marketPrice: 99,
					percentageDelta: 0,
					stopPrice: 100
				},
				output: { exitTrailing: true, stopPrice: 100 }
			},
			// If `direction` is "DOWN" and `marketPrice` is above `stopPrice`, then `exitTrailing` is true.
			{
				input: {
					direction: "DOWN",
					marketPrice: 101,
					percentageDelta: 0,
					stopPrice: 100
				},
				output: { exitTrailing: true, stopPrice: 100 }
			},
			// Return adjusted `stopPrice` according to `percentageDelta`.
			{
				input: {
					direction: "UP",
					marketPrice: 100,
					percentageDelta: 0.01,
					stopPrice: 50
				},
				output: { exitTrailing: false, stopPrice: 99 }
			},
			{
				input: {
					direction: "DOWN",
					marketPrice: 100,
					percentageDelta: 0.01,
					stopPrice: 150
				},
				output: { exitTrailing: false, stopPrice: 101 }
			}
		]
		testData.forEach(({ input, output }) => {
			assert.deepEqual(trailingStop(input), output)
		})
	})
})
