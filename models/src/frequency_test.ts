import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { everyOneHour, frequenciesAreEqual } from "./frequency.js"

type FrequenciesAreEqualArgs = Parameters<typeof frequenciesAreEqual>

test("frequenciesAreEqual", () => {
	assertEqual<FrequenciesAreEqualArgs, boolean>(
		(frequencies: FrequenciesAreEqualArgs) =>
			frequenciesAreEqual(...frequencies),
		[
			{
				input: [everyOneHour(), undefined],
				output: false
			},
			{
				input: [everyOneHour(), everyOneHour()],
				output: true
			}
		]
	)
})
