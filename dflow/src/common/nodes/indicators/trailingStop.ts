import { DflowNode } from "dflow"

const { input, output } = DflowNode

const inputs = [
	input("number", { name: "marketPrice" }),
	input("number", { name: "stopPrice" }),
	input("number", { name: "percentageDelta" })
]

const outputs = [
	output("boolean", { name: "exitTrailing" }),
	output("number", { name: "stopPrice" })
]

const trailingStopInputDirections = ["UP", "DOWN"] as const
type TrailingStopInputDirection = (typeof trailingStopInputDirections)[number]

export type TrailingStopInput = {
	direction: TrailingStopInputDirection
	marketPrice: number
	percentageDelta: number
	stopPrice: number
}

export type TrailingStopOutput = {
	exitTrailing: boolean
	stopPrice: number
}

export const trailingStop = ({
	direction,
	marketPrice,
	percentageDelta,
	stopPrice
}: TrailingStopInput): TrailingStopOutput => {
	if (direction === "UP") {
		// If `direction` is "UP" and `marketPrice` is above `stopPrice`, then `exitTrailing` is true.
		if (marketPrice <= stopPrice) return { exitTrailing: true, stopPrice }

		return {
			exitTrailing: false,
			// Compute next `stopPrice`.
			stopPrice: marketPrice - marketPrice * percentageDelta
		}
	}

	if (direction === "DOWN") {
		// If `direction` is "DOWN" and `marketPrice` is below `stopPrice`, then `exitTrailing` is true.
		if (marketPrice >= stopPrice) return { exitTrailing: true, stopPrice }

		return {
			exitTrailing: false,
			// Compute next `stopPrice`.
			stopPrice: marketPrice + marketPrice * percentageDelta
		}
	}

	return { exitTrailing: false, stopPrice }
}

export class TrailingStopUp extends DflowNode {
	static kind = "trailingStopUp"
	static inputs = inputs
	static outputs = outputs
	async run() {
		const direction: TrailingStopInputDirection = "UP"
		const marketPrice = this.input(0).data as number
		const stopPrice = this.input(1).data as number
		const percentageDelta = this.input(2).data as number
		const result = trailingStop({
			direction,
			marketPrice,
			percentageDelta,
			stopPrice
		})
		this.output(0).data = result.exitTrailing
		this.output(1).data = result.stopPrice
	}
}

export class TrailingStopDown extends DflowNode {
	static kind = "trailingStopDown"
	static inputs = inputs
	static outputs = outputs
	async run() {
		const direction: TrailingStopInputDirection = "DOWN"
		const marketPrice = this.input(0).data as number
		const stopPrice = this.input(1).data as number
		const percentageDelta = this.input(2).data as number
		const result = trailingStop({
			direction,
			marketPrice,
			percentageDelta,
			stopPrice
		})
		this.output(0).data = result.exitTrailing
		this.output(1).data = result.stopPrice
	}
}
