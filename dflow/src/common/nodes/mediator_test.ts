import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { addMediation, AddMediationInput, AddMediationOutput, exitMediation, ExitMediationInput } from "./mediator.js"

test("addMediation", () => {
	assertDeepEqual<AddMediationInput, AddMediationOutput>(addMediation, [
		// First iteration.
		{
			input: {
				averagePrice: 0,
				numPositions: 0,
				percentageGain: 0.01,
				price: 100_000,
				quantity: 42,
				totalQuantity: 0
			},
			output: {
				numPositions: 1,
				totalQuantity: 42,
				averagePrice: 100000
			}
		},

		// First iteration.
		{
			input: {
				averagePrice: 0,
				numPositions: 0,
				percentageGain: 0.01,
				price: 100_000,
				quantity: 42,
				totalQuantity: 0
			},
			output: {
				numPositions: 1,
				totalQuantity: 42,
				averagePrice: 100000
			}
		},

		{
			input: {
				averagePrice: 80_000,
				numPositions: 1,
				percentageGain: 0.1,
				price: 70_000,
				quantity: 2,
				totalQuantity: 1
			},
			output: {
				numPositions: 2,
				totalQuantity: 3,
				averagePrice: 73333.33333333
			}
		},
		{
			input: {
				averagePrice: 70_000,
				numPositions: 1,
				percentageGain: 0.1,
				price: 80_000,
				quantity: 2,
				totalQuantity: 1
			},
			output: {
				numPositions: 2,
				totalQuantity: 3,
				averagePrice: 76666.66666667
			}
		},

		{
			input: {
				averagePrice: 80_000,
				numPositions: 1,
				percentageGain: 0.017,
				price: 70_000,
				quantity: 2,
				totalQuantity: 1
			},
			output: {
				numPositions: 2,
				totalQuantity: 3,
				averagePrice: 73333.33333333
			}
		},
		{
			input: {
				averagePrice: 70_000,
				numPositions: 1,
				percentageGain: 0.017,
				price: 80_000,
				quantity: 2,
				totalQuantity: 1
			},
			output: {
				numPositions: 2,
				totalQuantity: 3,
				averagePrice: 76666.66666667
			}
		}
	])
})

test("exitMediation", () => {
	assertDeepEqual<ExitMediationInput, ReturnType<typeof exitMediation>>(exitMediation, [
		// First iteration.
		{
			input: {
				direction: "LONG",
				averagePrice: 0,
				percentageGain: 0.01,
				price: 100_000
			},
			output: false
		},

		// First iteration.
		{
			input: {
				direction: "SHORT",
				averagePrice: 0,
				percentageGain: 0.01,
				price: 100_000
			},
			output: false
		}
	])
})
