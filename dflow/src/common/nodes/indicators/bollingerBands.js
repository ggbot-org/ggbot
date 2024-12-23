import { Dflow, DflowNode } from 'dflow'

import { add, defaultPrecision, div, mul, sub } from '../arithmetic.js'
import { inputPeriod, inputValues } from '../commonIO.js'
import { exponentialMovingAverage, simpleMovingAverage } from './movingAverages.js'

const { input, output } = Dflow

const bollingerInputs = [
	inputValues,
	inputPeriod,
	input('number', { name: 'amplitude', optional: true })
]

const bollingerOutputs = [
	output('array', { name: 'lower' }),
	output('array', { name: 'middle' }),
	output('array', { name: 'upper' })
]

// Compute the variance with double precision.
const precision = defaultPrecision * 2

/** @type {import('./bollingerBands').bollinger} */
export function bollinger(values, period, amplitude = 2) {
	const size = values.length
	if (size < period) return [[], [], []]
	const middle = simpleMovingAverage(values, period)
	const lower /** @type {MaybeNumber[]} */ = ([])
	const upper /** @type {MaybeNumber[]} */ = ([])
	for (let index = period; index <= size; index++) {
		const average = middle[index - period]
		const variance = values
			.slice(index - period, index)
			.reduce((sum, decimal, index, array) => {
				const distance = sub(decimal, average)
				const result = /** @type {number} */ (add(sum, mul(distance, distance, precision), precision))
				return index === array.length - 1 ? /** @type {number} */ (div(result, period, precision)) : result
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
		const values = /** @type {number[]} */ (this.input(0).data)
		const period = /** @type {number} */ (this.input(1).data)
		const amplitude = /** @type {number | undefined} */ (this.input(2).data)
		const [lower, middle, upper] = bollinger(values, period, amplitude)
		this.output(0).data = lower
		this.output(1).data = middle
		this.output(2).data = upper
	}
}

/** @type {import('./bollingerBands').bollinger} */
function bollingerEMA(values, period, amplitude = 2) {
	const size = values.length
	if (size < period) return [[], [], []]
	const middle = exponentialMovingAverage(values, period)
	const lower /** @type {MaybeNumber[]} */ = ([])
	const upper /** @type {MaybeNumber[]} */ = ([])
	for (let index = period; index <= size; index++) {
		const average = middle[index - period]
		const variance = values
			.slice(index - period, index)
			.reduce((sum, decimal, index, array) => {
				const distance = sub(decimal, average)
				const result = /** @type {number} */ (add(sum, mul(distance, distance, precision), precision))
				return index === array.length - 1 ? /** @type {number} */ (div(result, period, precision)) : result
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
		const values = /** @type {number[]} */ (this.input(0).data)
		const period = /** @type {number} */ (this.input(1).data)
		const amplitude = /** @type {number | undefined} */ (this.input(2).data)
		const [lower, middle, upper] = bollingerEMA(values, period, amplitude)
		this.output(0).data = lower
		this.output(1).data = middle
		this.output(2).data = upper
	}
}
