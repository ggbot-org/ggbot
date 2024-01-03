import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { everyOneHour,frequenciesAreEqual } from "./frequency.js"

type FrequenciesAreEqualArgs = Parameters<typeof frequenciesAreEqual>

void describe("frequenciesAreEqual", () => {
	void test("checks two frequencies are the same", () => {
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
})
