import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Scheduling, schedulingsAreInactive } from "./scheduling.js"

describe("schedulingsAreInactive", () => {
	test("checks if schedulings are inactive overall", () => {
		const testData: Array<{
			input: Scheduling[]
			output: boolean
		}> = [
			{
				input: [],
				output: true
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 1, interval: "1h" }
					}
				],
				output: true
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 2, interval: "1h" }
					},
					{
						status: "active",
						frequency: { every: 3, interval: "1h" }
					}
				],
				output: false
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 2, interval: "1h" }
					},
					{
						status: "inactive",
						frequency: { every: 3, interval: "1h" }
					}
				],
				output: true
			}
		]

		testData.forEach(({ input, output }) => {
			assert.equal(
				schedulingsAreInactive(input),
				output,
				`schedulingsAreInactive(${JSON.stringify(input)}) !== ${output}`
			)
		})
	})
})
