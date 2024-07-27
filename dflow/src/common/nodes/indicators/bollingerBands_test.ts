import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { bollingerBands } from "./bollingerBands.js"

type BollingerBands = typeof bollingerBands

type BollingerBandsInput = {
	values: Parameters<BollingerBands>[0]
	period: Parameters<BollingerBands>[1]
	amplitude: Parameters<BollingerBands>[2]
}

test("Bollinger Bands", () => {
	assertDeepEqual<BollingerBandsInput, ReturnType<typeof bollingerBands>>(
		({ values, period, amplitude }: BollingerBandsInput) =>
			bollingerBands(values, period, amplitude),
		[
			{
				input: { values: [], period: 1, amplitude: 2 },
				output: [[], [], []]
			},
			{
				input: {
					values: [
						81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99,
						84.55, 84.36, 85.53, 86.54, 86.89, 87.77, 87.29
					],
					period: 5,
					amplitude: 2
				},
				output: [
					[
						80.53004219, 80.98714192, 82.53334324, 82.47198345,
						82.41775044, 82.43520292, 82.51133078, 83.14261781,
						83.53648779, 83.8703237, 85.28887096
					],
					[
						82.426, 82.738, 83.094, 83.318, 83.628, 83.778, 84.254,
						84.994, 85.574, 86.218, 86.804
					],
					[
						84.32195781, 84.48885808, 83.65465676, 84.16401655,
						84.83824956, 85.12079708, 85.99666922, 86.84538219,
						87.61151221, 88.5656763, 88.31912904
					]
				]
			}
		]
	)
})
