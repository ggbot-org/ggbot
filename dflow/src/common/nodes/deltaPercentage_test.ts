import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { now } from "minimal-time-helpers"

import { getDflowExecutionOutputData } from "../executor.js"
import { DflowExecutorMock } from "../mocks/executor.js"

void describe("deltaPercentage", () => {
	void test("works", async () => {
		const nodeId = "nodeId"
		const a = [30, 10, 100, 100, 0]
		const b = [20, 20, 98, 102]
		const executor = new DflowExecutorMock({
			view: {
				nodes: [
					{
						id: "i1",
						text: JSON.stringify(a),
						outs: [{ id: "o1" }]
					},
					{
						id: "i2",
						text: JSON.stringify(b),
						outs: [{ id: "o2" }]
					},
					{
						id: nodeId,
						text: "deltaPercentage",
						ins: [{ id: "a" }, { id: "b" }]
					}
				],
				edges: [
					{ id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
					{ id: "e2", from: ["i2", "o2"], to: [nodeId, "b"] }
				]
			}
		})
		const { execution } = await executor.run({
			params: {},
			memory: {},
			time: now()
		})
		assert.deepEqual(
			getDflowExecutionOutputData(execution, nodeId, 0),
			[-33.33, 100, -2, 2]
		)
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 1), 2)
	})
})