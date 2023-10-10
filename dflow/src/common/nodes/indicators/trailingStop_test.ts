import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { now } from "minimal-time-helpers"

import { DflowCommonContext } from "../../context.js"
import { getDflowExecutionOutputData } from "../../executor.js"
import { DflowExecutorMock } from "../../mocks/executor.js"
import {
	trailingStop,
	TrailingStopDown,
	TrailingStopInput,
	TrailingStopOutput,
	TrailingStopUp
} from "./trailingStop.js"

type ExecuteTrailingStopInput = Omit<TrailingStopInput, "direction"> &
	Pick<DflowCommonContext, "memory">
type ExecuteTrailingStopOutput = Partial<TrailingStopOutput> &
	Pick<DflowCommonContext, "memory" | "memoryChanged">

type TrailingStopTestData = {
	input: ExecuteTrailingStopInput
	output: ExecuteTrailingStopOutput
}

const executeTrailingStop = async (
	nodeKind: typeof TrailingStopUp.kind | typeof TrailingStopDown.kind,
	{
		marketPrice,
		stopPrice,
		percentageDelta,
		memory: memoryInput
	}: ExecuteTrailingStopInput
): Promise<ExecuteTrailingStopOutput> => {
	const nodeId = "testId"
	const executor = new DflowExecutorMock({
		view: {
			nodes: [
				{
					id: "marketPrice",
					text: JSON.stringify(marketPrice),
					outs: [{ id: "o1" }]
				},
				{
					id: "stopPrice",
					text: JSON.stringify(stopPrice),
					outs: [{ id: "o2" }]
				},
				{
					id: "percentageDelta",
					text: JSON.stringify(percentageDelta),
					outs: [{ id: "o3" }]
				},
				{
					id: nodeId,
					text: nodeKind,
					ins: [{ id: "i1" }, { id: "i2" }, { id: "i3" }]
				}
			],
			edges: [
				{
					id: "e1",
					from: ["marketPrice", "o1"],
					to: [nodeId, "i1"]
				},
				{ id: "e2", from: ["stopPrice", "o2"], to: [nodeId, "i2"] },
				{
					id: "e3",
					from: ["percentageDelta", "o3"],
					to: [nodeId, "i3"]
				}
			]
		}
	})
	const {
		execution,
		memory: memoryOutput,
		memoryChanged
	} = await executor.run({
		input: {},
		memory: memoryInput,
		time: now()
	})

	const exitTrailing = getDflowExecutionOutputData(execution, nodeId, 0)

	return {
		exitTrailing:
			typeof exitTrailing === "boolean" ? exitTrailing : undefined,
		memory: memoryOutput,
		memoryChanged
	}
}

describe("Trailing Stop", () => {
	test("TrailingStopUp", async () => {
		const testData: TrailingStopTestData[] = [
			{
				input: {
					marketPrice: 100,
					stopPrice: 90,
					percentageDelta: 0,
					memory: {}
				},
				output: {
					exitTrailing: false,
					memory: {},
					memoryChanged: false
				}
			}
		]
		for (const { input, output } of testData) {
			const { exitTrailing, memory, memoryChanged } =
				await executeTrailingStop(TrailingStopUp.kind, input)
			assert.equal(exitTrailing, output.exitTrailing)
			assert.equal(memoryChanged, output.memoryChanged)
			assert.deepEqual(memory, output.memory)
		}
	})

	test("TrailingStopDown", async () => {
		const testData: TrailingStopTestData[] = [
			{
				input: {
					marketPrice: 100,
					stopPrice: 110,
					percentageDelta: 0,
					memory: {}
				},
				output: {
					exitTrailing: false,
					memory: {},
					memoryChanged: false
				}
			}
		]
		for (const { input, output } of testData) {
			const { exitTrailing, memory, memoryChanged } =
				await executeTrailingStop(TrailingStopDown.kind, input)
			assert.equal(exitTrailing, output.exitTrailing)
			assert.equal(memoryChanged, output.memoryChanged)
			assert.deepEqual(memory, output.memory)
		}
	})

	test("trailingStop", () => {
		const testData: {
			input: TrailingStopInput
			output: TrailingStopOutput
		}[] = [
			// If `direction` is "UP" and `marketPrice` is below `stopPrice`, then `exitTrailing` is true.
			{
				input: {
					direction: "UP",
					marketPrice: 99,
					percentageDelta: 0,
					stopPrice: 100
				},
				output: { exitTrailing: true, stopPrice: 100 }
			},
			// If `direction` is "DOWN" and `marketPrice` is above `stopPrice`, then `exitTrailing` is true.
			{
				input: {
					direction: "DOWN",
					marketPrice: 101,
					percentageDelta: 0,
					stopPrice: 100
				},
				output: { exitTrailing: true, stopPrice: 100 }
			},
			// Return adjusted `stopPrice` according to `percentageDelta`.
			{
				input: {
					direction: "UP",
					marketPrice: 100,
					percentageDelta: 0.01,
					stopPrice: 50
				},
				output: { exitTrailing: false, stopPrice: 99 }
			},
			{
				input: {
					direction: "DOWN",
					marketPrice: 100,
					percentageDelta: 0.01,
					stopPrice: 150
				},
				output: { exitTrailing: false, stopPrice: 101 }
			},
			// Leave `stopPrice` as is when `marketPrice` gets closer.
			{
				input: {
					direction: "UP",
					marketPrice: 100,
					percentageDelta: 0.02,
					stopPrice: 99
				},
				output: { exitTrailing: false, stopPrice: 99 }
			},
			{
				input: {
					direction: "DOWN",
					marketPrice: 100,
					percentageDelta: 0.02,
					stopPrice: 101
				},
				output: { exitTrailing: false, stopPrice: 101 }
			}
		]
		testData.forEach(({ input, output }) => {
			assert.deepEqual(trailingStop(input), output)
		})
	})
})
