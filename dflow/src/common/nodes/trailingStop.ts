import { Dflow, DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../context.js"
import { add, mul, sub } from "./arithmetic.js"

const { input, output } = Dflow

const inputs = [
	input([], { name: "enterTrailing" }),
	input("string", { name: "memoryLabel" }),
	input("number", { name: "marketPrice" }),
	input("number", { name: "percentageDelta" }),
	input("number", { name: "initialStopPrice", optional: true }),
	input([], { name: "resetTrailing", optional: true })
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
}): number => add(marketPrice, mul(marketPrice, percentageDelta)) as number
export const computeStopPriceUp: ComputeStopPrice = ({
	marketPrice,
	percentageDelta
}): number => sub(marketPrice, mul(marketPrice, percentageDelta)) as number

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
		const initialStopPrice = this.input(4).data as number | undefined
		const resetTrailing = this.input(5).data

		const context = this.host.context as Context

		const { entryPriceMemoryKey, stopPriceMemoryKey } = trailingStopMemoryKeys(memoryLabel)

		const cleanupMemory = () => {
			delete context.memory[entryPriceMemoryKey]
			delete context.memory[stopPriceMemoryKey]
			context.memoryChanged = true
		}

		if (resetTrailing) {
			cleanupMemory()
			return this.clearOutputs()
		}

		if (!isValidPercentageDelta(percentageDelta)) return

		// Read memory.
		const stopPriceInMemory = context.memory[stopPriceMemoryKey]
		const entryPriceInMemory = context.memory[entryPriceMemoryKey]
		let stopPrice = typeof stopPriceInMemory === "number" ? stopPriceInMemory : undefined

		// Initialize `stopPrice`, if needed.
		if (stopPrice === undefined && enterTrailing) {
			if (typeof initialStopPrice === "number" && initialStopPrice < marketPrice) stopPrice = initialStopPrice
			else stopPrice = computeStopPriceUp({ marketPrice, percentageDelta })
		}

		// Nothing to do if there is no `stopPrice`.
		if (typeof stopPrice !== "number") return

		// Save `entryPrice` and `stopPrice` in memory.
		if (enterTrailing && entryPriceInMemory === undefined && stopPriceInMemory === undefined) {
			context.memoryChanged = true
			context.memory[entryPriceMemoryKey] = marketPrice
			context.memory[stopPriceMemoryKey] = stopPrice
		}

		// Compute trailing.
		const { exitTrailing, stopPrice: nextStopPrice } = trailingStop({ direction, marketPrice, percentageDelta, stopPrice })
		this.output(0).data = exitTrailing
		if (exitTrailing) {
			cleanupMemory()
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
		const initialStopPrice = this.input(4).data as number | undefined
		const resetTrailing = this.input(5).data

		const context = this.host.context as Context

		const { entryPriceMemoryKey, stopPriceMemoryKey } = trailingStopMemoryKeys(memoryLabel)

		const cleanupMemory = () => {
			delete context.memory[entryPriceMemoryKey]
			delete context.memory[stopPriceMemoryKey]
			context.memoryChanged = true
		}

		if (resetTrailing) {
			cleanupMemory()
			return this.clearOutputs()
		}

		if (!isValidPercentageDelta(percentageDelta)) return

		// Read memory.
		const stopPriceInMemory = context.memory[stopPriceMemoryKey]
		const entryPriceInMemory = context.memory[entryPriceMemoryKey]
		let stopPrice = typeof stopPriceInMemory === "number" ? stopPriceInMemory : undefined

		// Initialize `stopPrice`, if needed.
		if (stopPrice === undefined && enterTrailing) {
			if (typeof initialStopPrice === "number" && initialStopPrice > marketPrice) stopPrice = initialStopPrice
			else stopPrice = computeStopPriceDown({ marketPrice, percentageDelta })
		}

		// Nothing to do if there is no `stopPrice`.
		if (typeof stopPrice !== "number") return

		// Save `entryPrice` and `stopPrice` in memory.
		if (
			enterTrailing &&
			entryPriceInMemory === undefined &&
			stopPriceInMemory === undefined
		) {
			context.memoryChanged = true
			context.memory[entryPriceMemoryKey] = marketPrice
			context.memory[stopPriceMemoryKey] = stopPrice
		}

		// Compute trailing.
		const { exitTrailing, stopPrice: nextStopPrice } = trailingStop({ direction, marketPrice, percentageDelta, stopPrice })
		this.output(0).data = exitTrailing
		if (exitTrailing) {
			cleanupMemory()
		} else if (stopPrice !== nextStopPrice) {
			// Save next stopPrice
			context.memoryChanged = true
			context.memory[stopPriceMemoryKey] = nextStopPrice
		}
	}
}
