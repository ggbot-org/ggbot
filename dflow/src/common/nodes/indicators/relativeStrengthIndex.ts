import {
	add,
	coerceToDecimal,
	Decimal,
	decimalToNumber,
	div,
	maxNumOfDecimals,
	mul,
	sub
} from "@ggbot2/arithmetic"
import { DflowNode } from "dflow"

import {
	inputPeriod,
	inputValues,
	outputLastValue,
	outputValues
} from "../commonIO.js"
import { MovingAverage } from "./movingAverages.js"

export const relativeStrengthIndex: MovingAverage = (values, period) => {
	const size = values.length
	if (size < period) return []
	const numDecimals = maxNumOfDecimals(values)
	const decimalValues = values.map((value) =>
		coerceToDecimal(value, numDecimals)
	)
	const upwards: Decimal[] = []
	const downwards: Decimal[] = []
	for (let i = 1; i < size; i++) {
		const current = decimalValues[i]
		const previous = decimalValues[i - 1]
		const upward: Decimal =
			current > previous ? sub(current, previous) : "0"
		const downward: Decimal =
			current < previous ? sub(previous, current) : "0"
		upwards.push(upward)
		downwards.push(downward)
	}
	const sumUp = upwards
		.slice(0, period)
		.reduce<Decimal>((a, b) => add(a, b), "0")
	const sumDown = downwards
		.slice(0, period)
		.reduce<Decimal>((a, b) => add(a, b), "0")
	const smoothUp = div(sumUp, period)
	const smoothDown = div(sumDown, period)
	const smoothUps: Decimal[] = [smoothUp]
	const smoothDowns: Decimal[] = [smoothDown]
	const decimalOutputs: Decimal[] = [
		mul(100, div(smoothUp, add(smoothUp, smoothDown)))
	]
	for (let i = period + 1; i < size; i++) {
		const previousSmoothUp = smoothUps[i - period - 1]
		const previousSmoothDown = smoothDowns[i - period - 1]
		const upward = upwards[i - 1]
		const downward = downwards[i - 1]
		const smoothUp = add(
			div(sub(upward, previousSmoothUp), period),
			previousSmoothUp
		)
		smoothUps.push(smoothUp)
		const smoothDown = add(
			div(sub(downward, previousSmoothDown), period),
			previousSmoothDown
		)
		smoothDowns.push(smoothDown)
		decimalOutputs.push(mul(100, div(smoothUp, add(smoothUp, smoothDown))))
	}
	return decimalOutputs.map((value) => decimalToNumber(value, numDecimals))
}

export class RelativeStrengthIndex extends DflowNode {
	static kind = "RSI"
	static inputs = [inputValues, inputPeriod]
	static outputs = [outputValues, outputLastValue]
	async run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const result = relativeStrengthIndex(values, period)
		this.output(0).data = result
		this.output(1).data = result.slice(-1).pop()
	}
}
