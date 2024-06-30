import { strict as assert } from "node:assert"
import { test } from "node:test"

import { Dflow } from "dflow"
import { now } from "minimal-time-helpers"

import { getDflowExecutionOutputData } from "../executor.js"
import { DflowExecutorMock } from "../mocks/executor.js"
import {
	Addition,
	Division,
	Multiplication,
	Subtraction
} from "./arithmetic.js"

test("add", async () => {
	const operator: ArithmeticNodeKind = "add"
	const testData: ExecuteOperatorTestData[] = [
		{
			input: { a: 2, b: 3 },
			output: 5
		},
		{
			input: { a: 0.2, b: 0.1 },
			output: 0.3
		}
	]

	for (const { input, output } of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

test("sub", async () => {
	const operator: ArithmeticNodeKind = "sub"
	const testData: ExecuteOperatorTestData[] = [
		{
			input: { a: 2, b: 3 },
			output: -1
		}
	]

	for (const { input, output } of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

test("mul", async () => {
	const operator: ArithmeticNodeKind = "mul"
	const testData: ExecuteOperatorTestData[] = [
		{
			input: { a: 2, b: 3 },
			output: 6
		}
	]

	for (const { input, output } of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

test("div", async () => {
	const operator: ArithmeticNodeKind = "div"
	const testData: ExecuteOperatorTestData[] = [
		{
			input: { a: 3, b: 2 },
			output: 1.5
		},
		// Division by zero
		{
			input: { a: 1, b: 0 },
			output: undefined
		}
	]

	for (const { input, output } of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

const arithmeticOperators = [
	Addition.kind,
	Subtraction.kind,
	Multiplication.kind,
	Division.kind
] as const
type ArithmeticNodeKind = (typeof arithmeticOperators)[number]

type ExecuteOperatorInput = {
	a: number
	b: number
}

type ExecuteOperatorOutput = number | undefined

type ExecuteOperatorTestData = {
	input: ExecuteOperatorInput
	output: ExecuteOperatorOutput
}

const executeOperator = async (
	nodeKind: ArithmeticNodeKind,
	{ a, b }: ExecuteOperatorInput
): Promise<ExecuteOperatorOutput> => {
	const nodeId = "operator"
	const executor = new DflowExecutorMock({
		graph: {
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
					text: nodeKind,
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
	const result = getDflowExecutionOutputData(execution, nodeId, 0)
	if (result === undefined || Dflow.isNumber(result)) return result
	throw new TypeError()
}
