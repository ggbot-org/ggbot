import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { nodeTextToDflowKind, nodeTextToViewType } from './nodeResolution.js'

test('nodeTextToDflowKind', () => {
	type TestData = Array<{
		input: string;
		output: ReturnType<typeof nodeTextToDflowKind>;
	}>
	const testData: TestData = [
		{ input: 'this is a comment', output: 'info' },
		{ input: 'foo', output: 'foo' },
		{ input: '%1', output: 'perc' },
		{ input: '[1,2,3]', output: 'data' },
	]

	for (const { input, output } of testData) {
		assert.equal(nodeTextToDflowKind(input), output)
	}
})

type NodeTextToViewType = typeof nodeTextToViewType
test('nodeTextToViewType', () => {
	type TestData = Array<{
		input: Parameters<NodeTextToViewType>[0];
		output: ReturnType<NodeTextToViewType>;
	}>
	const testData: TestData = [
		// Resolves node containing comments to `info` type.
		{ input: 'this is a comment, it contains spaces', output: 'info' },
		{ input: 'this\nis\na\ncomment', output: 'info' },
		{ input: 'thisCouldBeSomeNode', output: undefined },
		// Resolves node containing JSON to `json` type.
		{ input: '1', output: 'json' },
		{ input: 'true', output: 'json' },
		{ input: 'false', output: 'json' },
		{ input: '{"message":"hello world"}', output: 'json' },
		{ input: '[ 1 ]', output: 'json' },
		// Resolves node containing a percentage to `percentage` type.
		{ input: '1%', output: 'perc' },
		{ input: '0%', output: 'perc' },
		{ input: '-1%', output: 'perc' },
		{ input: '1.5%', output: 'perc' },
		{ input: '10.1 %', output: 'perc' },
		{ input: '1  %', output: 'perc' },
		{ input: ' -2  %', output: 'perc' },
	]

	for (const { input, output } of testData) {
		assert.equal(nodeTextToViewType(input), output)
	}
})
