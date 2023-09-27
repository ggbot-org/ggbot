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
			{
				input: {
					direction: "UP",
					marketPrice: "0",
					percentageDelta: "0",
					stopPrice: undefined
				},
				output: { exitTrailing: undefined, stopPrice: undefined }
			},
			// If `direction` is "UP" and `marketPrice` is above `stopPrice`, then `exitTrailing` is true.
			{
				input: {
					direction: "UP",
					marketPrice: "101",
					percentageDelta: "0",
					stopPrice: "100"
				},
				output: { exitTrailing: true, stopPrice: "100" }
			},
			// If `direction` is "DOWN" and `marketPrice` is below `stopPrice`, then `exitTrailing` is true.
			{
				input: {
					direction: "DOWN",
					marketPrice: "99",
					percentageDelta: "0",
					stopPrice: "100"
				},
				output: { exitTrailing: true, stopPrice: "100" }
			}
		]
		testData.forEach(({ input, output }) => {
			assert.deepEqual(trailingStop(input), output)
		})
	})
})
