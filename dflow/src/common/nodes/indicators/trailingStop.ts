import { DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../../context.js"

const { input, output } = DflowNode

const inputs = [
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

type ComputeStopPrice = (
	arg: Pick<TrailingStopInput, "marketPrice" | "percentageDelta">
) => TrailingStopInput["stopPrice"]
const computeStopPriceUp: ComputeStopPrice = ({
	marketPrice,
	percentageDelta
}) => marketPrice - marketPrice * percentageDelta
const computeStopPriceDown: ComputeStopPrice = ({
	marketPrice,
	percentageDelta
}) => marketPrice + marketPrice * percentageDelta

/**
 * Prevent percentageDelta from be 0 or negative or greater than 1, otherwise
 * algorithm does not make sense.
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
	async run() {
		const direction: TrailingStopInputDirection = "UP"
		const memoryLabel = this.input(0).data as string
		const marketPrice = this.input(1).data as number
		const percentageDelta = this.input(2).data as number
		if (!isValidPercentageDelta(percentageDelta)) return
		const { entryPriceMemoryKey, stopPriceMemoryKey } =
			trailingStopMemoryKeys(memoryLabel)
		const stopPriceInMemory = (this.host.context as Context).memory[
			stopPriceMemoryKey
		]
		const isFirstIteration = typeof stopPriceInMemory !== "number"
		const stopPrice = isFirstIteration
			? computeStopPriceUp({ marketPrice, percentageDelta })
			: stopPriceInMemory
		if (isFirstIteration) {
			// Save entryPrice and stopPrice.
			(this.host.context as Context).memoryChanged = true
			;(this.host.context as Context).memory[entryPriceMemoryKey] =
				marketPrice
			;(this.host.context as Context).memory[stopPriceMemoryKey] =
				stopPrice
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
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete (this.host.context as Context).memory[entryPriceMemoryKey]
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete (this.host.context as Context).memory[stopPriceMemoryKey]
			;(this.host.context as Context).memoryChanged = true
		} else if (stopPrice !== nextStopPrice) {
			// Save next stopPrice
			(this.host.context as Context).memoryChanged = true
			;(this.host.context as Context).memory[stopPriceMemoryKey] =
				nextStopPrice
		}
	}
}

export class TrailingStopDown extends DflowNode {
	static kind = "trailingStopDown"
	static inputs = inputs
	static outputs = outputs
	async run() {
		const direction: TrailingStopInputDirection = "DOWN"
		const memoryLabel = this.input(0).data as string
		const marketPrice = this.input(1).data as number
		const percentageDelta = this.input(2).data as number
		if (!isValidPercentageDelta(percentageDelta)) return
		const { entryPriceMemoryKey, stopPriceMemoryKey } =
			trailingStopMemoryKeys(memoryLabel)
		const stopPriceInMemory = (this.host.context as Context).memory[
			stopPriceMemoryKey
		]
		const isFirstIteration = typeof stopPriceInMemory !== "number"
		const stopPrice = isFirstIteration
			? computeStopPriceDown({ marketPrice, percentageDelta })
			: stopPriceInMemory
		if (isFirstIteration) {
			// Save entryPrice and stopPrice.
			(this.host.context as Context).memoryChanged = true
			;(this.host.context as Context).memory[entryPriceMemoryKey] =
				marketPrice
			;(this.host.context as Context).memory[stopPriceMemoryKey] =
				stopPrice
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
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete (this.host.context as Context).memory[entryPriceMemoryKey]
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete (this.host.context as Context).memory[stopPriceMemoryKey]
			;(this.host.context as Context).memoryChanged = true
		} else if (stopPrice !== nextStopPrice) {
			// Save next stopPrice
			(this.host.context as Context).memoryChanged = true
			;(this.host.context as Context).memory[stopPriceMemoryKey] =
				nextStopPrice
		}
	}
}
