import { DflowNode } from "dflow"

import { add, div, MaybeNumber, mul, sub } from "../arithmetic.js"
import { inputPeriod, inputValues, outputLastValue, outputValues } from "../commonIO.js"

export function relativeStrengthIndex(values: number[], period: number): number[] {
	const size = values.length
	if (size < period) return []
	const upwards: MaybeNumber[] = []
	const downwards: MaybeNumber[] = []
	for (let i = 1; i < size; i++) {
		const current = values[i]
		const previous = values[i - 1]
		const upward: MaybeNumber = current > previous ? (sub(current, previous) as number) : 0
		const downward: MaybeNumber = current < previous ? (sub(previous, current) as number) : 0
		upwards.push(upward)
		downwards.push(downward)
	}
	const sumUp = upwards.slice(0, period).reduce<MaybeNumber>((a, b) => add(a, b), 0)
	const sumDown = downwards.slice(0, period).reduce<MaybeNumber>((a, b) => add(a, b), 0)
	const smoothUp = div(sumUp, period)
	const smoothDown = div(sumDown, period)
	const smoothUps: MaybeNumber[] = [smoothUp]
	const smoothDowns: MaybeNumber[] = [smoothDown]
	// TODO
	// try to avoid castings to number (see below untile ned of function body),
	// there could be a divide by zero
	const result: number[] = [
		mul(100, div(smoothUp, add(smoothUp, smoothDown))) as number
	]
	for (let i = period + 1; i < size; i++) {
		const previousSmoothUp = smoothUps[i - period - 1]
		const previousSmoothDown = smoothDowns[i - period - 1]
		const upward = upwards[i - 1]
		const downward = downwards[i - 1]
		const smoothUp = add(div(sub(upward, previousSmoothUp), period), previousSmoothUp) as number
		smoothUps.push(smoothUp)
		const smoothDown = add(div(sub(downward, previousSmoothDown), period), previousSmoothDown)
		smoothDowns.push(smoothDown)
		result.push(mul(100, div(smoothUp, add(smoothUp, smoothDown))) as number)
	}
	return result
}

export class RelativeStrengthIndex extends DflowNode {
	static kind = "RSI"
	static inputs = [inputValues, inputPeriod]
	static outputs = [outputValues, outputLastValue]
	run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const result = relativeStrengthIndex(values, period)
		this.output(0).data = result
		this.output(1).data = result.slice(-1).pop()
	}
}
