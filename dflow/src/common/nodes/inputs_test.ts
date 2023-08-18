import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { now } from "minimal-time-helpers"

import { getDflowExecutionOutputData } from "../executor.js"
import { DflowExecutorMock } from "../mocks/executor.js"

describe("inputBoolean", () => {
	it("reads context inputs", async () => {
		const nodeId = "test"
		const executor = new DflowExecutorMock({
			view: {
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
						text: "inputBoolean",
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
					{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
				]
			}
		})
		const value = false
		const { execution } = await executor.run({
			input: { foo: value },
			memory: {},
			time: now()
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
	})

	it("use default input if context input is not available", async () => {
		const nodeId = "test"
		const executor = new DflowExecutorMock({
			view: {
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
						text: "inputBoolean",
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
					{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
				]
			}
		})
		const { execution } = await executor.run({
			input: {},
			memory: {},
			time: now()
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), false)
	})
})

describe("inputNumber", () => {
	it("reads context inputs", async () => {
		const nodeId = "test"
		const executor = new DflowExecutorMock({
			view: {
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
						text: "inputNumber",
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
					{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
				]
			}
		})
		const value = 10
		const { execution } = await executor.run({
			input: { foo: value },
			memory: {},
			time: now()
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
	})

	it("use default input if context input is not available", async () => {
		const nodeId = "test"
		const executor = new DflowExecutorMock({
			view: {
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
						text: "inputNumber",
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
					{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
				]
			}
		})
		const { execution } = await executor.run({
			input: {},
			memory: {},
			time: now()
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), -1.2)
	})
})

describe("inputString", () => {
	it("reads context inputs", async () => {
		const nodeId = "test"
		const executor = new DflowExecutorMock({
			view: {
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
						text: "inputString",
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
					{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
				]
			}
		})
		const value = "bar"
		const { execution } = await executor.run({
			input: { foo: value },
			memory: {},
			time: now()
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
	})

	it("use default input if context input is not available", async () => {
		const nodeId = "test"
		const executor = new DflowExecutorMock({
			view: {
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
						text: "inputString",
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
					{ id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] }
				]
			}
		})
		const { execution } = await executor.run({
			input: {},
			memory: {},
			time: now()
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), "bar")
	})
})
