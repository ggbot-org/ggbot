import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { now } from "minimal-time-helpers"

import { DflowCommonExecutor, getDflowExecutionOutputData } from "../executor.js"

describe("booleanParameter", () => {
	test("reads context params", async () => {
		const nodeId = "test"
		const executor = new DflowCommonExecutor({
			nodes: [
				{
					id: "k",
					text: '"foo"',
					ins: [],
					outs: [{ id: "o1" }]
				},
				{
					id: "v",
					text: "false",
					ins: [],
					outs: [{ id: "o2" }]
				},
				{
					id: nodeId,
					text: "booleanParameter",
					ins: [{ id: "i1" }, { id: "i2" }],
					outs: [{ id: "o1" }]
				}
			],
			edges: [
				{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
				{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
			]
		})
		const value = false
		const { execution } = await executor.run({ params: { foo: value }, memory: {}, time: now() })
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
	})

	test("use default if context param is not available", async () => {
		const nodeId = "test"
		const executor = new DflowCommonExecutor({
			nodes: [
				{
					id: "k",
					text: '"foo"',
					outs: [{ id: "o1" }]
				},
				{
					id: "v",
					text: "false",
					outs: [{ id: "o2" }]
				},
				{
					id: nodeId,
					text: "booleanParameter",
					ins: [{ id: "i1" }, { id: "i2" }],
					outs: [{ id: "o1" }]
				}
			],
			edges: [
				{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
				{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
			]
		})
		const { execution } = await executor.run({ params: {}, memory: {}, time: now() })
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), false)
	})
})

describe("numberParameter", () => {
	test("reads context params", async () => {
		const nodeId = "test"
		const executor = new DflowCommonExecutor({
			nodes: [
				{
					id: "k",
					text: '"foo"',
					ins: [],
					outs: [{ id: "o1" }]
				},
				{
					id: "v",
					text: "2",
					ins: [],
					outs: [{ id: "o2" }]
				},
				{
					id: nodeId,
					text: "numberParameter",
					ins: [{ id: "i1" }, { id: "i2" }],
					outs: [{ id: "o1" }]
				}
			],
			edges: [
				{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
				{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
			]
		})
		const value = 10
		const { execution } = await executor.run({ params: { foo: value }, memory: {}, time: now() })
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
	})

	test("use default if context param is not available", async () => {
		const nodeId = "test"
		const executor = new DflowCommonExecutor({
			nodes: [
				{
					id: "k",
					text: '"foo"',
					outs: [{ id: "o1" }]
				},
				{
					id: "v",
					text: "-1.2",
					outs: [{ id: "o2" }]
				},
				{
					id: nodeId,
					text: "numberParameter",
					ins: [{ id: "i1" }, { id: "i2" }],
					outs: [{ id: "o1" }]
				}
			],
			edges: [
				{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
				{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
			]
		})
		const { execution } = await executor.run({ params: {}, memory: {}, time: now() })
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), -1.2)
	})
})

describe("stringParameter", () => {
	test("reads context params", async () => {
		const nodeId = "test"
		const executor = new DflowCommonExecutor({
			nodes: [
				{
					id: "k",
					text: '"foo"',
					ins: [],
					outs: [{ id: "o1" }]
				},
				{
					id: "v",
					text: '"bar"',
					ins: [],
					outs: [{ id: "o2" }]
				},
				{
					id: nodeId,
					text: "stringParameter",
					ins: [{ id: "i1" }, { id: "i2" }],
					outs: [{ id: "o1" }]
				}
			],
			edges: [
				{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
				{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
			]
		})
		const value = "bar"
		const { execution } = await executor.run({ params: { foo: value }, memory: {}, time: now() })
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
	})

	test("use default if context param is not available", async () => {
		const nodeId = "test"
		const executor = new DflowCommonExecutor({
			nodes: [
				{
					id: "k",
					text: '"foo"',
					outs: [{ id: "o1" }]
				},
				{
					id: "v",
					text: '"bar"',
					outs: [{ id: "o2" }]
				},
				{
					id: nodeId,
					text: "stringParameter",
					ins: [{ id: "i1" }, { id: "i2" }],
					outs: [{ id: "o1" }]
				}
			],
			edges: [
				{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
				{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
			]
		})
		const { execution } = await executor.run({ params: {}, memory: {}, time: now() })
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), "bar")
	})
})
