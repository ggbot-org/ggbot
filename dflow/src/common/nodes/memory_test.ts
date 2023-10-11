import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { DflowData } from "dflow"
import { now } from "minimal-time-helpers"

import { getDflowExecutionOutputData } from "../executor.js"
import { DflowExecutorMock } from "../mocks/executor.js"

describe("deleteMemory", () => {
	test("can delete context memory", async () => {
		const executor = new DflowExecutorMock({
			view: {
				nodes: [
					{
						id: "a",
						text: '"key1"',
						outs: [{ id: "b" }]
					},
					{
						id: "c",
						text: "deleteMemory",
						ins: [{ id: "d" }]
					}
				],
				edges: [{ id: "e", from: ["a", "b"], to: ["c", "d"] }]
			}
		})
		const { memory, memoryChanged } = await executor.run({
			input: {},
			memory: { key1: "value1" },
			time: now()
		})
		assert.equal(memoryChanged, true)
		assert.equal(memory.key1, undefined)
	})
})

describe("getMemory", () => {
	test("can read context memory", async () => {
		const testValues: Array<{ value: DflowData }> = [
			{ value: 42 },
			{ value: "a string" },
			{ value: ["a", "b"] }
		]
		for (const { value } of testValues) {
			const executor = new DflowExecutorMock({
				view: {
					nodes: [
						{
							id: "a",
							text: '"key1"',
							outs: [{ id: "b" }]
						},
						{
							id: "c",
							text: "getMemory",
							ins: [{ id: "d" }]
						}
					],
					edges: [{ id: "e", from: ["a", "b"], to: ["c", "d"] }]
				}
			})
			const { execution, memory, memoryChanged } = await executor.run({
				input: {},
				memory: { key1: value },
				time: now()
			})
			assert.equal(memoryChanged, false)
			assert.deepEqual(memory.key1, value)
			assert.equal(getDflowExecutionOutputData(execution, "c", 0), value)
		}
	})
})

describe("setMemory", () => {
	test("can set context memory", async () => {
		const executor = new DflowExecutorMock({
			view: {
				nodes: [
					{
						id: "a",
						text: '"key1"',
						outs: [{ id: "b" }]
					},
					{
						id: "c",
						text: "1.2",
						outs: [{ id: "d" }]
					},
					{
						id: "e",
						text: "setMemory",
						ins: [{ id: "f" }, { id: "g" }]
					}
				],
				edges: [
					{ id: "h", from: ["a", "b"], to: ["e", "f"] },
					{ id: "i", from: ["c", "d"], to: ["e", "g"] }
				]
			}
		})
		const { memory, memoryChanged } = await executor.run({
			input: {},
			memory: {},
			time: now()
		})
		assert.equal(memoryChanged, true)
		assert.equal(memory.key1, 1.2)
	})
})
