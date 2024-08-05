import { DflowNode } from "dflow"

import { add, div, mul, sub } from "../arithmetic.js"
import { inputPeriod, inputValues, outputLastValue, outputValues } from "../commonIO.js"

export type MovingAverage = (values: number[], period: number) => number[]

const movingAverageInputs = [inputValues, inputPeriod]

const movingAverageOutputs = [outputValues, outputLastValue]

export const exponentialMovingAverage: MovingAverage = (values, period) => {
	const size = values.length
	if (size < period) return []
	const result: number[] = [values[0]]
	for (let i = 1; i < size; i++) {
		const previous = result[i - 1]
		result.push(
			// It is ok to cast to `number`, since `period` cannot be -1 cause it is greater than `size`.
			add(
				div(mul(sub(values[i], previous), 2), period + 1),
				previous
			) as number
		)
	}
	return result
}

export class ExponentialMovingAverage extends DflowNode {
	static kind = "EMA"
	static inputs = movingAverageInputs
	static outputs = movingAverageOutputs
	run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const result = exponentialMovingAverage(values, period)
		this.output(0).data = result
		this.output(1).data = result.slice(-1).pop()
	}
}

export const simpleMovingAverage: MovingAverage = (values, period) => {
	if (values.length < period) return []
	return values.reduce<number[]>((result, _value, index, array) => {
		if (index < period - 1) return result
		const movingValues = array.slice(index - period + 1, index + 1)
		const sum = movingValues.reduce<number>(
			// It is ok to cast to `number` cause inputs are numbers.
			(a, b) => add(a, b) as number, 0)
		// It is ok to cast to `number`, since `period` is greater than `index + 1` where `index` starts from zero.
		const average = div(sum, period) as number
		return result.concat(average)
	}, [])
}

export class SimpleMovingAverage extends DflowNode {
	static kind = "SMA"
	static inputs = movingAverageInputs
	static outputs = movingAverageOutputs
	run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const result = simpleMovingAverage(values, period)
		this.output(0).data = result
		this.output(1).data = result.slice(-1).pop()
	}
}

export const wilderSmoothing: MovingAverage = (values, period) => {
	const size = values.length
	if (size < period) return []
	const sum = values.slice(0, period).reduce<number>(
		// It is ok to cast to `number` cause inputs are numbers.
		(a, b) => add(a, b) as number,
		0
	)
	const result: number[] = [
		// It is ok to cast to number cause `period` is greater than `size` hence it is positive.
		div(sum, period) as number
	]
	for (let i = period; i < size; i++) {
		const previous = result[i - period]
		result.push(add(div(sub(values[i], previous), period), previous) as number)
	}
	return result
}

export class WilderMovingAverage extends DflowNode {
	static kind = "WilderMA"
	static inputs = movingAverageInputs
	static outputs = movingAverageOutputs
	run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const result = wilderSmoothing(values, period)
		this.output(0).data = result
		this.output(1).data = result.slice(-1).pop()
	}
}
