import { test } from 'node:test'

import { assertEqual } from 'minimal-assertion-helpers'

import { parsePercentage } from './nodeTextParser.js'

test('parsePercentage', () => {
	assertEqual<string, number>(parsePercentage, [
		{ input: '1%', output: 0.01 },
		{ input: '-1%', output: -0.01 },
		{ input: '42%', output: 0.42 },
		{ input: '0.1%', output: 0.001 },
		{ input: '2.01%', output: 0.0201 },
		{ input: '+2%', output: 0.02 },
		{ input: '1 %', output: 0.01 },
		{ input: ' 1 %', output: 0.01 },
		{ input: '1 % ', output: 0.01 },
		{ input: '- 1%', output: -0.01 },
		{ input: '-1 %', output: -0.01 },
		{ input: '- 1 %', output: -0.01 },
	])
})
