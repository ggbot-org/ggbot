import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { extractCommonParameters } from "./flow.js"
import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"

test("extractCommonParameters", () => {
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
						outs: [{ id: "o1" }]
					},
					{
						id: "n2",
						text: JSON.stringify(booleanValue),
						outs: [{ id: "o1" }]
					},
					{
						id: "n3",
						text: BooleanParameter.kind,
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
						outs: [{ id: "o1" }]
					},
					{
						id: "n2",
						text: JSON.stringify(numberValue),
						outs: [{ id: "o1" }]
					},
					{
						id: "n3",
						text: NumberParameter.kind,
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
						outs: [{ id: "o1" }]
					},
					{
						id: "n2",
						text: JSON.stringify(stringValue),
						outs: [{ id: "o1" }]
					},
					{
						id: "n3",
						text: StringParameter.kind,
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
