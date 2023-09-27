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
			}
		]
		testData.forEach(({ input, output }) => {
			assert.deepEqual(trailingStop(input), output)
		})
	})
})
