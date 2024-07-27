import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import {
	exponentialMovingAverage,
	simpleMovingAverage,
	wilderSmoothing
} from "./movingAverages.js"

type ExponentialMovingAverage = typeof exponentialMovingAverage
type ExponentialMovingAverageInput = {
	values: Parameters<ExponentialMovingAverage>[0]
	period: Parameters<ExponentialMovingAverage>[1]
}

test("Exponential Moving Average", () => {
	assertDeepEqual<
		ExponentialMovingAverageInput,
		ReturnType<ExponentialMovingAverage>
	>(
		({ values, period }: ExponentialMovingAverageInput) =>
			exponentialMovingAverage(values, period),
		[
			{ input: { values: [], period: 1 }, output: [] },
			{
				input: {
					values: [
						81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99,
						84.55, 84.36, 85.53, 86.54, 86.89, 87.77, 87.29
					],
					period: 5
				},
				output: [
					81.59, 81.41333333, 81.89888889, 82.26592593, 82.71395062,
					82.85930041, 82.85286694, 83.23191129, 83.67127419,
					83.90084946, 84.44389964, 85.14259976, 85.72506651,
					86.40671101, 86.70114067
				]
			}
		]
	)
})

type SimpleMovingAverage = typeof simpleMovingAverage
type SimpleMovingAverageInput = {
	values: Parameters<SimpleMovingAverage>[0]
	period: Parameters<SimpleMovingAverage>[1]
}

test("Simple Moving Average", () => {
	assertDeepEqual<SimpleMovingAverageInput, ReturnType<SimpleMovingAverage>>(
		({ values, period }: SimpleMovingAverageInput) =>
			simpleMovingAverage(values, period),
		[
			{ input: { values: [], period: 1 }, output: [] },
			{
				input: {
					values: [
						81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99,
						84.55, 84.36, 85.53, 86.54, 86.89, 87.77, 87.29
					],
					period: 5
				},
				output: [
					82.426, 82.738, 83.094, 83.318, 83.628, 83.778, 84.254,
					84.994, 85.574, 86.218, 86.804
				]
			}
		]
	)
})

type WilderSmoothing = typeof wilderSmoothing
type WilderSmoothingInput = {
	values: Parameters<WilderSmoothing>[0]
	period: Parameters<WilderSmoothing>[1]
}

test("Wilder's smoothing", () => {
	assertDeepEqual<WilderSmoothingInput, ReturnType<WilderSmoothing>>(
		({ values, period }: WilderSmoothingInput) =>
			wilderSmoothing(values, period),
		[
			{
				input: { values: [], period: 1 },
				output: []
			},
			{
				input: {
					values: [
						81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99,
						84.55, 84.36, 85.53, 86.54, 86.89, 87.77, 87.29
					],
					period: 5
				},
				output: [
					82.426, 82.5708, 82.62464, 82.897712, 83.2281696,
					83.45453568, 83.86962854, 84.40370283, 84.90096226,
					85.47476981, 85.83781585
				]
			}
		]
	)
})
