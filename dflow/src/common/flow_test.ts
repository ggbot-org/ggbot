import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { extractCommonParameters } from "./flow.js"
import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"

void test("extractCommonParameters", () => {
	const booleanValue = false
	const booleanKey = "my boolean"
	const numberValue = 1.2
	const numberKey = "my number"
	const stringValue = "string"
	const stringKey = "my string"

	assertDeepEqual<
		Parameters<typeof extractCommonParameters>[0],
		ReturnType<typeof extractCommonParameters>
	>(extractCommonParameters, [
		{
			input: {
				nodes: [
					{
						id: "n1",
						text: JSON.stringify(booleanKey),
						x: 0,
						y: 0,
						outs: [{ id: "o1" }]
					},
					{
						id: "n2",
						text: JSON.stringify(booleanValue),
						x: 0,
						y: 0,
						outs: [{ id: "o1" }]
					},
					{
						id: "n3",
						text: BooleanParameter.kind,
						x: 0,
						y: 0,
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["n1", "o1"], to: ["n3", "i1"] },
					{ id: "e2", from: ["n2", "o1"], to: ["n3", "i2"] }
				]
			},
			output: [
				{
					kind: BooleanParameter.kind,
					key: booleanKey,
					defaultValue: booleanValue
				}
			]
		},
		{
			input: {
				nodes: [
					{
						id: "n1",
						text: JSON.stringify(numberKey),
						x: 0,
						y: 0,
						outs: [{ id: "o1" }]
					},
					{
						id: "n2",
						text: JSON.stringify(numberValue),
						x: 0,
						y: 0,
						outs: [{ id: "o1" }]
					},
					{
						id: "n3",
						text: NumberParameter.kind,
						x: 0,
						y: 0,
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["n1", "o1"], to: ["n3", "i1"] },
					{ id: "e2", from: ["n2", "o1"], to: ["n3", "i2"] }
				]
			},
			output: [
				{
					kind: NumberParameter.kind,
					key: numberKey,
					defaultValue: numberValue
				}
			]
		},
		{
			input: {
				nodes: [
					{
						id: "n1",
						text: JSON.stringify(stringKey),
						x: 0,
						y: 0,
						outs: [{ id: "o1" }]
					},
					{
						id: "n2",
						text: JSON.stringify(stringValue),
						x: 0,
						y: 0,
						outs: [{ id: "o1" }]
					},
					{
						id: "n3",
						text: StringParameter.kind,
						x: 0,
						y: 0,
						ins: [{ id: "i1" }, { id: "i2" }],
						outs: [{ id: "o1" }]
					}
				],
				edges: [
					{ id: "e1", from: ["n1", "o1"], to: ["n3", "i1"] },
					{ id: "e2", from: ["n2", "o1"], to: ["n3", "i2"] }
				]
			},
			output: [
				{
					kind: StringParameter.kind,
					key: stringKey,
					defaultValue: stringValue
				}
			]
		}
	])
})
