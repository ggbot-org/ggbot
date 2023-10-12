import { strict as assert } from "node:assert"

type Value = Parameters<typeof JSON.stringify>[0]

// TODO consider publish this on package minimal-assertion-helpers
export const assertDeepEqual = <Input extends Value, Output extends Value>(
	// eslint-disable-next-line @typescript-eslint/ban-types
	func: Function,
	testData: Array<{ input: Input; output: Output }>
) => {
	for (const { input, output } of testData)
		assert.deepEqual<Output>(
			func(input),
			output,
			`${func.name}(${JSON.stringify(
				input,
				null,
				2
			)}) !== ${JSON.stringify(output, null, 2)}`
		)
}

export const assertEqual = <Input extends Value, Output extends Value>(
	// eslint-disable-next-line @typescript-eslint/ban-types
	func: Function,
	testData: Array<{ input: Input; output: Output }>
) => {
	for (const { input, output } of testData)
		assert.deepEqual<Output>(
			func(input),
			output,
			`${func.name}(${JSON.stringify(
				input,
				null,
				2
			)}) !== ${JSON.stringify(output)}`
		)
}
