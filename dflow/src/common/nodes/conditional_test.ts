import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { now } from "minimal-time-helpers"

import { getDflowExecutionOutputData } from "../executor.js"
import { DflowExecutorMock } from "../mocks/executor.js"

describe("if", () => {
	test("implements `if` condition", async () => {
		const nodeId = "if"
		const executor = new DflowExecutorMock({
			view: {
				nodes: [
					{
						id: "i1",
						text: "false",
						outs: [{ id: "o1" }]
					},
					{
						id: "i2",
						text: "1",
						outs: [{ id: "o2" }]
					},
					{
						id: "i3",
						text: "2",
						outs: [{ id: "o3" }]
					},
					{
						id: nodeId,
						text: "if",
						ins: [
							{ id: "condition" },
							{ id: "then" },
							{ id: "else" }
						]
					}
				],
				edges: [
					{ id: "e1", from: ["i1", "o1"], to: [nodeId, "condition"] },
					{ id: "e2", from: ["i2", "o2"], to: [nodeId, "then"] },
					{ id: "e3", from: ["i3", "o3"], to: [nodeId, "else"] }
				]
			}
		})
		const { execution } = await executor.run({
			input: {},
			memory: {},
			time: now()
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 2)
	})
})
