import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { now } from "minimal-time-helpers"

import { getDflowExecutionOutputData } from "../executor.js"
import { DflowExecutorMock } from "../mocks/executor.js"

void describe("add", () => {
	void test("implements addition", async () => {
		const nodeId = "operator"
		const a = 2
		const b = 3
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
						text: "add",
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
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 5)
	})
})

void describe("sub", () => {
	void test("implements subtraction", async () => {
		const nodeId = "operator"
		const a = 2
		const b = 3
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
						text: "sub",
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
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), a - b)
	})
})

void describe("mul", () => {
	void test("implements multiplication", async () => {
		const nodeId = "operator"
		const a = 2
		const b = 3
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
						text: "mul",
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
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), a * b)
	})
})

void describe("div", () => {
	void test("implements multiplication", async () => {
		const nodeId = "operator"
		const a = 3
		const b = 2
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
						text: "div",
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
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), a / b)
	})
})
