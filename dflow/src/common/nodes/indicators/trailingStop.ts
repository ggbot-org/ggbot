import { add, decimalToNumber, mul, sub } from "@workspace/arithmetic"
import { DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../../context.js"

const { input, output } = DflowNode

const inputs = [
	input([], { name: "enterTrailing", optional: true }),
	input("string", { name: "memoryLabel" }),
	input("number", { name: "marketPrice" }),
	input("number", { name: "percentageDelta" })
]

const outputs = [output("boolean", { name: "exitTrailing" })]

const trailingStopInputDirections = ["UP", "DOWN"] as const
type TrailingStopInputDirection = (typeof trailingStopInputDirections)[number]

export type TrailingStopInput = {
	direction: TrailingStopInputDirection
	marketPrice: number
	percentageDelta: number
	stopPrice: number
}

export type TrailingStopOutput = Pick<TrailingStopInput, "stopPrice"> & {
	exitTrailing: boolean
}

export type ComputeStopPriceArg = Pick<
	TrailingStopInput,
	"marketPrice" | "percentageDelta"
>
type ComputeStopPrice = (
	arg: ComputeStopPriceArg
) => TrailingStopInput["stopPrice"]
export const computeStopPriceDown: ComputeStopPrice = ({
	marketPrice,
	percentageDelta
}) => decimalToNumber(add(marketPrice, mul(marketPrice, percentageDelta)))
export const computeStopPriceUp: ComputeStopPrice = ({
	marketPrice,
	percentageDelta
}) => decimalToNumber(sub(marketPrice, mul(marketPrice, percentageDelta)))

/**
 * Prevent percentageDelta from be zero or negative or one or greater than one,
 * otherwise algorithm does not make sense.
 */
const isValidPercentageDelta = (percentageDelta: number) => {
	if (percentageDelta <= 0) return false
	if (percentageDelta >= 1) return false
	return true
}

export const trailingStop = ({
	direction,
	marketPrice,
	percentageDelta,
	stopPrice
}: TrailingStopInput): TrailingStopOutput => {
	if (direction === "UP") {
		// If `direction` is "UP" and `marketPrice` is above `stopPrice`, then `exitTrailing` is true.
		if (marketPrice < stopPrice) return { exitTrailing: true, stopPrice }

		return {
			exitTrailing: false,
			// Compute next `stopPrice`.
			stopPrice: Math.max(
				stopPrice,
				computeStopPriceUp({ marketPrice, percentageDelta })
			)
		}
	}

	if (direction === "DOWN") {
		// If `direction` is "DOWN" and `marketPrice` is below `stopPrice`, then `exitTrailing` is true.
		if (marketPrice > stopPrice) return { exitTrailing: true, stopPrice }

		return {
			exitTrailing: false,
			// Compute next `stopPrice`.
			stopPrice: Math.min(
				stopPrice,
				computeStopPriceDown({ marketPrice, percentageDelta })
			)
		}
	}

	return { exitTrailing: false, stopPrice }
}

export const trailingStopMemoryKeys = (memoryLabel: string) => ({
	entryPriceMemoryKey: `trailing:entryPrice:${memoryLabel}`,
	stopPriceMemoryKey: `trailing:stopPrice:${memoryLabel}`
})

export class TrailingStopUp extends DflowNode {
	static kind = "trailingStopUp"
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: TrailingStopInputDirection = "UP"
		const enterTrailing = this.input(0).data
		const memoryLabel = this.input(1).data as string
		const marketPrice = this.input(2).data as number
		const percentageDelta = this.input(3).data as number
		const context = this.host.context as Context
		if (!isValidPercentageDelta(percentageDelta)) return
		const { entryPriceMemoryKey, stopPriceMemoryKey } =
			trailingStopMemoryKeys(memoryLabel)
		const stopPriceInMemory = context.memory[stopPriceMemoryKey]
		const entryPriceInMemory = context.memory[entryPriceMemoryKey]
		let stopPrice = stopPriceInMemory
		if (stopPrice === undefined) {
			if (!enterTrailing) return
			stopPrice = computeStopPriceUp({ marketPrice, percentageDelta })
		}
		if (typeof stopPrice !== "number") return
		if (
			enterTrailing &&
			entryPriceInMemory === undefined &&
			stopPriceInMemory === undefined
		) {
			// Save entryPrice and stopPrice.
			context.memoryChanged = true
			context.memory[entryPriceMemoryKey] = marketPrice
			context.memory[stopPriceMemoryKey] = stopPrice
		}
		const { exitTrailing, stopPrice: nextStopPrice } = trailingStop({
			direction,
			marketPrice,
			percentageDelta,
			stopPrice
		})
		this.output(0).data = exitTrailing
		if (exitTrailing) {
			// Cleanup memory.
			delete context.memory[entryPriceMemoryKey]
			delete context.memory[stopPriceMemoryKey]
			context.memoryChanged = true
		} else if (stopPrice !== nextStopPrice) {
			// Save next stopPrice
			context.memoryChanged = true
			context.memory[stopPriceMemoryKey] = nextStopPrice
		}
	}
}

export class TrailingStopDown extends DflowNode {
	static kind = "trailingStopDown"
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: TrailingStopInputDirection = "DOWN"
		const enterTrailing = this.input(0).data
		const memoryLabel = this.input(1).data as string
		const marketPrice = this.input(2).data as number
		const percentageDelta = this.input(3).data as number
		const context = this.host.context as Context
		if (!isValidPercentageDelta(percentageDelta)) return
		const { entryPriceMemoryKey, stopPriceMemoryKey } =
			trailingStopMemoryKeys(memoryLabel)
		const stopPriceInMemory = context.memory[stopPriceMemoryKey]
		const entryPriceInMemory = context.memory[entryPriceMemoryKey]
		let stopPrice = stopPriceInMemory
		if (stopPrice === undefined) {
			if (!enterTrailing) return
			stopPrice = computeStopPriceDown({
				marketPrice,
				percentageDelta
			})
		}
		if (typeof stopPrice !== "number") return
		if (
			enterTrailing &&
			entryPriceInMemory === undefined &&
			stopPriceInMemory === undefined
		) {
			// Save entryPrice and stopPrice.
			context.memoryChanged = true
			context.memory[entryPriceMemoryKey] = marketPrice
			context.memory[stopPriceMemoryKey] = stopPrice
		}
		const { exitTrailing, stopPrice: nextStopPrice } = trailingStop({
			direction,
			marketPrice,
			percentageDelta,
			stopPrice
		})
		this.output(0).data = exitTrailing
		if (exitTrailing) {
			// Cleanup memory.
			delete context.memory[entryPriceMemoryKey]
			delete context.memory[stopPriceMemoryKey]
			context.memoryChanged = true
		} else if (stopPrice !== nextStopPrice) {
			// Save next stopPrice
			context.memoryChanged = true
			context.memory[stopPriceMemoryKey] = nextStopPrice
		}
	}
}
