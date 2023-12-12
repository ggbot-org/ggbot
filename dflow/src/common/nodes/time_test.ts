import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { dayToTime } from "minimal-time-helpers"

import { getDflowExecutionOutputData } from "../executor.js"
import { DflowExecutorMock } from "../mocks/executor.js"
import { coerceToTimeUnit } from "./time.js"

void describe("coerceToTimeUnit", () => {
	void test("works", () => {
		[
			{ input: "not a TimeUnit", output: undefined },
			{ input: "seconds", output: "second" },
			{ input: "1s", output: "second" },
			{ input: "minutes", output: "minute" },
			{ input: "1m", output: "minute" },
			{ input: "hours", output: "hour" },
			{ input: "1h", output: "hour" },
			{ input: "days", output: "day" },
			{ input: "1d", output: "day" }
		].forEach(({ input, output }) => {
			assert.equal(coerceToTimeUnit(input), output)
		})
	})
})

void describe("today", () => {
	void test("reads context timestamp", async () => {
		const day = "1978-12-31"
		const nodeId = "a"
		const executor = new DflowExecutorMock({
			view: {
				nodes: [
					{
						id: nodeId,
						text: "today"
					}
				],
				edges: []
			}
		})
		const { execution } = await executor.run({
			params: {},
			memory: {},
			time: dayToTime(day)
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), day)
	})
})
