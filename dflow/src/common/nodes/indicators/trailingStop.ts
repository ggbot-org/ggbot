import { DflowNode } from "dflow"
import { isLiteralType } from "minimal-type-guard-helpers"

const { input, output } = DflowNode

const trailingStopInputDirections = ["UP", "DOWN"] as const
type TrailingStopInputDirection = (typeof trailingStopInputDirections)[number]
const isTrailingStopInputDirection = isLiteralType<TrailingStopInputDirection>(
	trailingStopInputDirections
)

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
	stopPrice
}: TrailingStopInput): TrailingStopOutput => {
	// If `direction` is "UP" and `marketPrice` is above `stopPrice`, then `exitTrailing` is true.
	if (direction === "UP" && marketPrice >= stopPrice)
		return { exitTrailing: true, stopPrice }
	// If `direction` is "DOWN" and `marketPrice` is below `stopPrice`, then `exitTrailing` is true.
	if (direction === "DOWN" && marketPrice <= stopPrice)
		return { exitTrailing: true, stopPrice }
	return { exitTrailing: false, stopPrice }
}

export class TrailingStop extends DflowNode {
	static kind = "trailingStop"
	static inputs = [input("string", { name: "direction" })]
	static outputs = [output("boolean", { name: "exitTrailing" })]
	async run() {
		const direction = this.input(0).data as string
		const marketPrice = undefined
		const percentageDelta = undefined
		const stopPrice = undefined
		if (
			!isTrailingStopInputDirection(direction) ||
			typeof marketPrice !== "number" ||
			typeof percentageDelta !== "number" ||
			typeof stopPrice !== "number"
		)
			return
		const { exitTrailing } = trailingStop({
			direction,
			marketPrice,
			percentageDelta,
			stopPrice
		})
		this.output(0).data = exitTrailing
	}
}
