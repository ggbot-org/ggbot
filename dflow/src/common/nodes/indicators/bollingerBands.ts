import { Dflow, DflowNode } from 'dflow'

import {
	add,
	defaultPrecision,
	div,
	MaybeNumber,
	mul,
	sub,
} from '../arithmetic.js'
import { inputPeriod, inputValues } from '../commonIO.js'
import {
	exponentialMovingAverage,
	simpleMovingAverage,
} from './movingAverages.js'

const { input, output } = Dflow

const bollingerInputs = [
	inputValues,
	inputPeriod,
	input('number', { name: 'amplitude', optional: true }),
]

const bollingerOutputs = [
	output('array', { name: 'lower' }),
	output('array', { name: 'middle' }),
	output('array', { name: 'upper' }),
]

// Compute the variance with double precision.
const precision = defaultPrecision * 2

/**
 * Compute classic bollinger bands.
 * @see {@link https://en.wikipedia.org/wiki/Bollinger_Bands}
 */
export function bollinger(
	values: number[],
	period: number,
	amplitude = 2
): [lower: MaybeNumber[], middle: MaybeNumber[], upper: MaybeNumber[]] {
	const size = values.length
	if (size < period) return [[], [], []]
	const middle = simpleMovingAverage(values, period)
	const lower: MaybeNumber[] = []
	const upper: MaybeNumber[] = []
	for (let index = period; index <= size; index++) {
		const average = middle[index - period]
		const variance = values
			.slice(index - period, index)
			.reduce<number>((sum, decimal, index, array) => {
				const distance = sub(decimal, average)
				const result = add(
					sum,
					mul(distance, distance, precision),
					precision
				) as number
				return index === array.length - 1
					? (div(result, period, precision) as number)
					: result
			}, 0)
		if (variance === undefined) {
			lower.push(undefined)
			upper.push(undefined)
		} else {
			const half = mul(amplitude, Math.sqrt(variance))
			lower.push(sub(average, half))
			upper.push(add(average, half))
		}
	}
	return [lower, middle, upper]
}

export class Bollinger extends DflowNode {
	static kind = 'Bollinger'
	static inputs = bollingerInputs
	static outputs = bollingerOutputs
	run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const amplitude = this.input(2).data as number | undefined
		const [lower, middle, upper] = bollinger(values, period, amplitude)
		this.output(0).data = lower
		this.output(1).data = middle
		this.output(2).data = upper
	}
}

/**
 * Compute a variant of bollinger bands using Exponential Moving Average.
 */
function bollingerEMA(
	values: number[],
	period: number,
	amplitude = 2
): [lower: MaybeNumber[], middle: MaybeNumber[], upper: MaybeNumber[]] {
	const size = values.length
	if (size < period) return [[], [], []]
	const middle = exponentialMovingAverage(values, period)
	const lower: MaybeNumber[] = []
	const upper: MaybeNumber[] = []
	for (let index = period; index <= size; index++) {
		const average = middle[index - period]
		const variance = values
			.slice(index - period, index)
			.reduce<number>((sum, decimal, index, array) => {
				const distance = sub(decimal, average)
				const result = add(
					sum,
					mul(distance, distance, precision),
					precision
				) as number
				return index === array.length - 1
					? (div(result, period, precision) as number)
					: result
			}, 0)
		if (variance === undefined) {
			lower.push(undefined)
			upper.push(undefined)
		} else {
			const half = mul(amplitude, Math.sqrt(variance))
			lower.push(sub(average, half))
			upper.push(add(average, half))
		}
	}
	return [lower, middle, upper]
}

export class BollingerEMA extends DflowNode {
	static kind = 'BollingerEMA'
	static inputs = bollingerInputs
	static outputs = bollingerOutputs
	run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const amplitude = this.input(2).data as number | undefined
		const [lower, middle, upper] = bollingerEMA(values, period, amplitude)
		this.output(0).data = lower
		this.output(1).data = middle
		this.output(2).data = upper
	}
}
