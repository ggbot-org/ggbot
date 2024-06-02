import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { mediation, MediatorInput, MediatorOutput } from "./mediator.js"

test("mediation", () => {
	assertDeepEqual<MediatorInput, MediatorOutput>(mediation, [
		{
			input: {
				direction: "LONG",
				addPosition: false,
				numPositionsInMemory: 0
			},
			output: { exitMediation: false, numPositions: 0 }
		},
		{
			input: {
				direction: "SHORT",
				addPosition: false,
				numPositionsInMemory: 0
			},
			output: { exitMediation: false, numPositions: 0 }
		},
		{
			input: {
				direction: "LONG",
				addPosition: true,
				numPositionsInMemory: 0
			},
			output: { exitMediation: false, numPositions: 1 }
		},
		{
			input: {
				direction: "SHORT",
				addPosition: true,
				numPositionsInMemory: 0
			},
			output: { exitMediation: false, numPositions: 1 }
		}
	])
})
