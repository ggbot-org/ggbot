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

import { inputPeriod, inputValues } from "../commonIO.js"
import { simpleMovingAverage } from "./movingAverages.js"

const { input, output } = DflowNode

export const bollingerBands = (
	values: number[],
	period: number,
	amplitude = 2
): [lower: number[], middle: number[], upper: number[]] => {
	const size = values.length
	if (size < period) return [[], [], []]
	const numDecimals = maxNumOfDecimals(values)
	const decimalValues = values.map((value) =>
		coerceToDecimal(value, numDecimals)
	)
	const middle = simpleMovingAverage(values, period)
	const lower: number[] = []
	const upper: number[] = []
	for (let index = period; index <= size; index++) {
		const average = middle[index - period]
		const variance = decimalValues
			.slice(index - period, index)
			.reduce<Decimal>((sum, decimal, index, array) => {
				const distance = sub(decimal, average)
				const result = add(sum, mul(distance, distance))
				const isLast = index === array.length - 1
				return isLast ? div(result, period) : result
			}, "0")
		const half = mul(amplitude, Math.sqrt(decimalToNumber(variance)))
		lower.push(decimalToNumber(sub(average, half, numDecimals)))
		upper.push(decimalToNumber(add(average, half, numDecimals)))
	}
	return [lower, middle, upper]
}

export class BollingerBands extends DflowNode {
	static kind = "Bollinger"
	static inputs = [
		inputValues,
		inputPeriod,
		input("number", { name: "amplitude", optional: true })
	]
	static outputs = [
		output("array", { name: "lower" }),
		output("array", { name: "middle" }),
		output("array", { name: "upper" })
	]
	async run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const amplitude = this.input(2).data as number | undefined
		const [lower, middle, upper] = bollingerBands(values, period, amplitude)
		this.output(0).data = lower
		this.output(1).data = middle
		this.output(2).data = upper
	}
}
