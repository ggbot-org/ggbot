import { Dflow, DflowNode } from "dflow"

import { add, div, MaybeNumber, mul, sub } from "../arithmetic.js"
import { inputPeriod, inputValues } from "../commonIO.js"
import { simpleMovingAverage } from "./movingAverages.js"

const { input, output } = Dflow

export const bollingerBands = (
	values: number[],
	period: number,
	amplitude = 2
): [lower: MaybeNumber[], middle: MaybeNumber[], upper: MaybeNumber[]] => {
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
				const result = add(sum, mul(distance, distance)) as number
				const isLast = index === array.length - 1
				return isLast ? (div(result, period) as number) : result
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
	run() {
		const values = this.input(0).data as number[]
		const period = this.input(1).data as number
		const amplitude = this.input(2).data as number | undefined
		const [lower, middle, upper] = bollingerBands(values, period, amplitude)
		this.output(0).data = lower
		this.output(1).data = middle
		this.output(2).data = upper
	}
}
