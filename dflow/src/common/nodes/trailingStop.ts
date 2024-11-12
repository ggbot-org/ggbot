import { Dflow, DflowNode } from 'dflow'

import { DflowCommonContext as Context } from '../context.js'
import { add, mul, sub } from './arithmetic.js'

const { input, output } = Dflow

const inputs = [
	input([], { name: 'enterTrailing' }),
	// TODO move memoryLabel position before resetTrailing
	input('string', { name: 'memoryLabel', optional: true }),
	input('number', { name: 'price' }),
	input('number', { name: 'percentageDelta' }),
	input('number', { name: 'initialStopPrice', optional: true }),
	input([], { name: 'resetTrailing', optional: true })
]

const outputs = [output('boolean', { name: 'exitTrailing' })]

type TrailingStopInputDirection = 'UP' | 'DOWN'

export type TrailingStopInput = {
	direction: TrailingStopInputDirection
	price: number
	percentageDelta: number
	stopPrice: number
}

export type TrailingStopOutput = Pick<TrailingStopInput, 'stopPrice'> & {
	exitTrailing: boolean
}

export type ComputeStopPriceArg = Pick<TrailingStopInput, 'price' | 'percentageDelta'>
type ComputeStopPrice = (arg: ComputeStopPriceArg) => TrailingStopInput['stopPrice']
export const computeStopPriceDown: ComputeStopPrice = ({
	price, percentageDelta
}): number => add(price, mul(price, percentageDelta)) as number
export const computeStopPriceUp: ComputeStopPrice = ({
	price, percentageDelta
}): number => sub(price, mul(price, percentageDelta)) as number

/**
 * Prevent percentageDelta from be zero or negative or one or greater than one,
 * otherwise algorithm does not make sense.
 */
function isValidPercentageDelta (percentageDelta: number) {
	if (percentageDelta <= 0) return false
	if (percentageDelta >= 1) return false
	return true
}

export function trailingStop ({
	direction, price, percentageDelta, stopPrice
}: TrailingStopInput): TrailingStopOutput {
	if (direction === 'UP') {
		// If `direction` is "UP" and `price` is above `stopPrice`, then `exitTrailing` is true.
		if (price < stopPrice) return { exitTrailing: true, stopPrice }

		return {
			exitTrailing: false,
			// Compute next `stopPrice`.
			stopPrice: Math.max(
				stopPrice,
				computeStopPriceUp({ price, percentageDelta })
			)
		}
	}

	if (direction === 'DOWN') {
		// If `direction` is "DOWN" and `price` is below `stopPrice`, then `exitTrailing` is true.
		if (price > stopPrice) return { exitTrailing: true, stopPrice }

		return {
			exitTrailing: false,
			// Compute next `stopPrice`.
			stopPrice: Math.min(
				stopPrice,
				computeStopPriceDown({ price, percentageDelta })
			)
		}
	}

	return { exitTrailing: false, stopPrice }
}

export function trailingStopMemoryKeys (memoryLabel?: string) {
	return ({
		entryPriceMemoryKey: memoryLabel ? `trailing:entryPrice:${memoryLabel}` : 'trailing:entryPrice',
		stopPriceMemoryKey: memoryLabel ? `trailing:stopPrice:${memoryLabel}` : 'trailing:stopPrice'
	})
}

export class TrailingStopUp extends DflowNode {
	static kind = 'trailingStopUp'
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: TrailingStopInputDirection = 'UP'
		const enterTrailing = this.input(0).data
		const memoryLabel = this.input(1).data as string | undefined
		const price = this.input(2).data as number
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
		let stopPrice = typeof stopPriceInMemory === 'number' ? stopPriceInMemory : undefined

		// Initialize `stopPrice`, if needed.
		if (stopPrice === undefined && enterTrailing) {
			if (typeof initialStopPrice === 'number' && initialStopPrice < price) stopPrice = initialStopPrice
			else stopPrice = computeStopPriceUp({ price, percentageDelta })
		}

		// Nothing to do if there is no `stopPrice`.
		if (typeof stopPrice !== 'number') return

		// Save `entryPrice` and `stopPrice` in memory.
		if (enterTrailing && entryPriceInMemory === undefined && stopPriceInMemory === undefined) {
			context.memoryChanged = true
			context.memory[entryPriceMemoryKey] = price
			context.memory[stopPriceMemoryKey] = stopPrice
		}

		// Compute trailing.
		const { exitTrailing, stopPrice: nextStopPrice } = trailingStop({ direction, price, percentageDelta, stopPrice })
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
	static kind = 'trailingStopDown'
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: TrailingStopInputDirection = 'DOWN'
		const enterTrailing = this.input(0).data
		const memoryLabel = this.input(1).data as string
		const price = this.input(2).data as number
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
		let stopPrice = typeof stopPriceInMemory === 'number' ? stopPriceInMemory : undefined

		// Initialize `stopPrice`, if needed.
		if (stopPrice === undefined && enterTrailing) {
			if (typeof initialStopPrice === 'number' && initialStopPrice > price) stopPrice = initialStopPrice
			else stopPrice = computeStopPriceDown({ price, percentageDelta })
		}

		// Nothing to do if there is no `stopPrice`.
		if (typeof stopPrice !== 'number') return

		// Save `entryPrice` and `stopPrice` in memory.
		if (
			enterTrailing &&
			entryPriceInMemory === undefined &&
			stopPriceInMemory === undefined
		) {
			context.memoryChanged = true
			context.memory[entryPriceMemoryKey] = price
			context.memory[stopPriceMemoryKey] = stopPrice
		}

		// Compute trailing.
		const { exitTrailing, stopPrice: nextStopPrice } = trailingStop({ direction, price, percentageDelta, stopPrice })
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
