import { test } from 'node:test'

import { assertEqual } from 'minimal-assertion-helpers'

import { nodeTextToDflowKind, nodeTextToViewType } from './nodeResolution.js'

test('nodeTextToDflowKind', () => {
	assertEqual<string, ReturnType<typeof nodeTextToDflowKind>>(
		nodeTextToDflowKind,
		[
			{ input: 'this is a comment', output: 'info' },
			{ input: 'foo', output: 'foo' },
			{ input: '%1', output: 'perc' },
			{ input: '[1,2,3]', output: 'data' }
		]
	)
})

type NodeTextToViewType = typeof nodeTextToViewType

test('nodeTextToViewType', () => {
	assertEqual<Parameters<NodeTextToViewType>[0], ReturnType<NodeTextToViewType>>(
		nodeTextToViewType, [
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
			{ input: ' -2  %', output: 'perc' }
		])
})
