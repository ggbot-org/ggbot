import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { now } from "minimal-time-helpers"

import { DflowCommonContext } from "../../context.js"
import { getDflowExecutionOutputData } from "../../executor.js"
import { DflowExecutorMock } from "../../mocks/executor.js"
import {
	ComputeStopPriceArg,
	computeStopPriceDown,
	computeStopPriceUp,
	trailingStop,
	TrailingStopDown,
	TrailingStopInput,
	trailingStopMemoryKeys,
	TrailingStopOutput,
	TrailingStopUp
} from "./trailingStop.js"

type ExecuteTrailingStopInput = Pick<
	TrailingStopInput,
	"marketPrice" | "percentageDelta"
> &
	Pick<DflowCommonContext, "memory"> & {
		memoryLabel: string
	}
type ExecuteTrailingStopOutput = Partial<TrailingStopOutput> &
	Pick<DflowCommonContext, "memory" | "memoryChanged">

type TrailingStopTestData = {
	input: ExecuteTrailingStopInput
	output: ExecuteTrailingStopOutput
}

const invalidPercentageDeltaValues = [0, 1]

const exitTrailingAssertionError = "check exitTrailing"
const memoryAssertionError = "check memory"
const memoryChangedAssertionError = "check memoryChanged"

const executeTrailingStop = async (
	nodeKind: typeof TrailingStopUp.kind | typeof TrailingStopDown.kind,
	{
		memoryLabel,
		marketPrice,
		percentageDelta,
		memory: memoryInput
	}: ExecuteTrailingStopInput
): Promise<ExecuteTrailingStopOutput> => {
	const nodeId = "testId"
	const executor = new DflowExecutorMock({
		view: {
			nodes: [
				{
					id: "memoryLabel",
					text: JSON.stringify(memoryLabel),
					outs: [{ id: "o1" }]
				},
				{
					id: "marketPrice",
					text: JSON.stringify(marketPrice),
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
				{ id: "e1", from: ["memoryLabel", "o1"], to: [nodeId, "i1"] },
				{
					id: "e2",
					from: ["marketPrice", "o2"],
					to: [nodeId, "i2"]
				},
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
		params: {},
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
		const memoryLabel = "test"
		const { entryPriceMemoryKey, stopPriceMemoryKey } =
			trailingStopMemoryKeys(memoryLabel)

		const testData: TrailingStopTestData[] = [
			// If percentageDelta is not valid, algorithm does not run.
			...invalidPercentageDeltaValues.map((percentageDelta) => ({
				input: {
					memoryLabel,
					marketPrice: 100,
					percentageDelta,
					memory: {}
				},
				output: {
					exitTrailing: undefined,
					memory: {},
					memoryChanged: false
				}
			})),

			// If there no memory on input, it gets initialized on first run.
			{
				input: {
					memoryLabel,
					marketPrice: 100,
					percentageDelta: 0.01,
					memory: {}
				},
				output: {
					exitTrailing: false,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 99
					},
					memoryChanged: true
				}
			},

			// stopPrice is read from memory as input and written as output
			{
				input: {
					memoryLabel,
					marketPrice: 106,
					percentageDelta: 0.01,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 99
					}
				},
				output: {
					exitTrailing: false,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 104.94
					},
					memoryChanged: true
				}
			},

			// stopPrice does not change if marketPrice gets closer.
			{
				input: {
					memoryLabel,
					marketPrice: 105,
					percentageDelta: 0.01,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 104.94
					}
				},
				output: {
					exitTrailing: false,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 104.94
					},
					memoryChanged: false
				}
			},

			// If marketPrice goes beyond stopPrice then exitTrailing is true and memory is cleaned up
			{
				input: {
					memoryLabel,
					marketPrice: 104.8,
					percentageDelta: 0.01,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 104.94
					}
				},
				output: {
					exitTrailing: true,
					memory: {},
					memoryChanged: true
				}
			}
		]

		for (const { input, output } of testData) {
			const { exitTrailing, memory, memoryChanged } =
				await executeTrailingStop(TrailingStopUp.kind, input)
			assert.equal(
				exitTrailing,
				output.exitTrailing,
				exitTrailingAssertionError
			)
			assert.equal(
				memoryChanged,
				output.memoryChanged,
				memoryChangedAssertionError
			)
			assert.deepEqual(memory, output.memory, memoryAssertionError)
		}
	})

	test("TrailingStopDown", async () => {
		const memoryLabel = "test"
		const { entryPriceMemoryKey, stopPriceMemoryKey } =
			trailingStopMemoryKeys(memoryLabel)

		const testData: TrailingStopTestData[] = [
			// If percentageDelta is not valid, algorithm does not run.
			...invalidPercentageDeltaValues.map((percentageDelta) => ({
				input: {
					memoryLabel,
					marketPrice: 100,
					percentageDelta,
					memory: {}
				},
				output: {
					exitTrailing: undefined,
					memory: {},
					memoryChanged: false
				}
			})),

			// If there no memory on input, it gets initialized on first run.
			{
				input: {
					memoryLabel,
					marketPrice: 100,
					percentageDelta: 0.01,
					memory: {}
				},
				output: {
					exitTrailing: false,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 101
					},
					memoryChanged: true
				}
			},

			// stopPrice is read from memory as input and written as output
			{
				input: {
					memoryLabel,
					marketPrice: 94,
					percentageDelta: 0.01,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 99
					}
				},
				output: {
					exitTrailing: false,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 94.94
					},
					memoryChanged: true
				}
			},

			// stopPrice does not change if marketPrice gets closer.
			{
				input: {
					memoryLabel,
					marketPrice: 94.9,
					percentageDelta: 0.01,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 94.94
					}
				},
				output: {
					exitTrailing: false,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 94.94
					},
					memoryChanged: false
				}
			},

			// If marketPrice goes beyond stopPrice then exitTrailing is true and memory is cleaned up
			{
				input: {
					memoryLabel,
					marketPrice: 94.98,
					percentageDelta: 0.01,
					memory: {
						[entryPriceMemoryKey]: 100,
						[stopPriceMemoryKey]: 94.94
					}
				},
				output: {
					exitTrailing: true,
					memory: {},
					memoryChanged: true
				}
			}
		]

		for (const { input, output } of testData) {
			const { exitTrailing, memory, memoryChanged } =
				await executeTrailingStop(TrailingStopDown.kind, input)
			assert.equal(
				exitTrailing,
				output.exitTrailing,
				exitTrailingAssertionError
			)
			assert.equal(
				memoryChanged,
				output.memoryChanged,
				memoryChangedAssertionError
			)
			assert.deepEqual(memory, output.memory, memoryAssertionError)
		}
	})

	test("trailingStop", () => {
		const testData: Array<{
			input: TrailingStopInput
			output: TrailingStopOutput
		}> = [
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

describe("computeStopPriceDown", () => {
	test("does not increase number of decimals", () => {
		assertEqual<ComputeStopPriceArg, number>(computeStopPriceDown, [
			{
				input: { marketPrice: 12345.6789, percentageDelta: 0.01 },
				output: 12222.2221
			}
		])
	})
})

describe("computeStopPriceUp", () => {
	test("does not increase number of decimals", () => {
		assertEqual<ComputeStopPriceArg, number>(computeStopPriceUp, [
			{
				input: { marketPrice: 12345.6789, percentageDelta: 0.01 },
				output: 12469.1357
			}
		])
	})
})
