import { Dflow, DflowNode } from 'dflow'

import { DflowCommonContext as Context } from '../context.js'
import { add, defaultPrecision, div, mul, sub } from './arithmetic.js'
import { inputPrice } from './commonIO.js'

const { input, output } = Dflow

const inputs = [
	inputPrice,
	input('number', { name: 'quantity', optional: true }),
	input('number', { name: 'percentageGain' }),
	input('string', { name: 'memoryLabel', optional: true }),
	input([], { name: 'resetMediation', optional: true })
]

const outputs = [
	output('boolean', { name: 'exitMediation' }),
	output('number', { name: 'numPositions' }),
	output('number', { name: 'totalQuantity' }),
	output('number', { name: 'averagePrice' })
]

type MediatorDirection = 'LONG' | 'SHORT'

export type AddMediationInput = {
	// Parameters.
	averagePrice: number
	numPositions: number
	percentageGain: number
	price: number
	quantity: number
	totalQuantity: number
}

export type AddMediationOutput = {
	averagePrice: number
	numPositions: number
	totalQuantity: number
}

export function addMediation({
	// Input parameters.
	price,
	quantity,
	// Memory parameters.
	averagePrice: previousAveragePrice,
	numPositions: previousNumPositions,
	totalQuantity: previousTotalQuantity
}: AddMediationInput): AddMediationOutput {
	const numPositions = previousNumPositions + 1
	const totalQuantity = add(previousTotalQuantity, quantity) as number

	// First iteration needs no computation.
	if (numPositions === 1) return {
		averagePrice: price,
		numPositions,
		totalQuantity
	}
	// TODO averagePrice computation is not correct.
	const averagePrice = div(
		add(
			mul(previousAveragePrice, previousTotalQuantity, defaultPrecision * 2),
			mul(price, quantity, defaultPrecision * 2)
		),
		totalQuantity
	) as number

	return {
		averagePrice,
		numPositions,
		totalQuantity
	}
}

export type ExitMediationInput = {
	direction: MediatorDirection
} & Pick<AddMediationInput, 'averagePrice' | 'percentageGain' | 'price'>

export function exitMediation({ direction, averagePrice, percentageGain, price }: ExitMediationInput) {
	if (averagePrice === 0) return false
	if (direction === 'LONG') {
		const breakingPrice = mul(averagePrice, add(1, percentageGain)) as number
		return price > breakingPrice
	}
	if (direction === 'SHORT') {
		const breakingPrice = mul(averagePrice, sub(1, percentageGain)) as number
		return price < breakingPrice
	}
}

type MemoryKey = 'averagePrice' | 'numPositions' | 'totalQuantity'

export class MediatorMemory {
	context: Context
	memoryKey: Record<MemoryKey, string>
	constructor(context: Context, memoryLabel?: string) {
		this.context = context
		this.memoryKey = {
			averagePrice: MediatorMemory.key('averagePrice', memoryLabel),
			numPositions: MediatorMemory.key('numPositions', memoryLabel),
			totalQuantity: MediatorMemory.key('totalQuantity', memoryLabel)
		}
	}
	get averagePrice() {
		const value = this.context.memory[this.memoryKey.averagePrice]
		if (typeof value === 'number') return value
		// Actually zero is not correct, but the mediator algorithm handles it.
		return 0
	}
	get numPositions() {
		const value = this.context.memory[this.memoryKey.numPositions]
		if (typeof value === 'number') return value
		return 0
	}
	get totalQuantity() {
		const value = this.context.memory[this.memoryKey.totalQuantity]
		if (typeof value === 'number') return value
		return 0
	}
	set averagePrice(value: number) {
		this.context.memoryChanged = value !== this.averagePrice
		this.context.memory[this.memoryKey.averagePrice] = value
	}
	set numPositions(value: number) {
		this.context.memoryChanged = value !== this.numPositions
		this.context.memory[this.memoryKey.numPositions] = value
	}
	set totalQuantity(value: number) {
		this.context.memoryChanged = value !== this.totalQuantity
		this.context.memory[this.memoryKey.totalQuantity] = value
	}
	static key(memoryKey: MemoryKey, memoryLabel?: string) {
		return memoryLabel ? `mediator:${memoryKey}:${memoryLabel}` : `mediator:${memoryKey}`
	}
	cleanup() {
		for (const key of Object.values(this.memoryKey)) {
			delete this.context.memory[key]
		}
		this.context.memoryChanged = true
	}
}

export class MediatorLong extends DflowNode {
	static kind = 'mediatorLong'
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: MediatorDirection = 'LONG'
		const price = this.input(0).data as number
		const quantity = this.input(1).data as number | undefined
		const percentageGain = this.input(2).data as number
		const memoryLabel = this.input(3).data as string | undefined
		const resetMediation = this.input(4).data

		const context = this.host.context as Context
		const memory = new MediatorMemory(context, memoryLabel)

		if (resetMediation) {
			memory.cleanup()
			return this.clearOutputs()
		}

		// Read memory.
		const {
			averagePrice: averagePriceInMemory,
			numPositions: numPositionsInMemory,
			totalQuantity: totalQuantityInMemory
		} = memory

		if (quantity) {
			// Add mediation.
			const {
				averagePrice,
				numPositions,
				totalQuantity
			} = addMediation({
				quantity,
				price,
				percentageGain,
				averagePrice: averagePriceInMemory,
				numPositions: numPositionsInMemory,
				totalQuantity: totalQuantityInMemory
			})

			const exited = exitMediation({ direction, averagePrice, percentageGain, price })

			// Set outputs.
			this.output(0).data = exited
			this.output(1).data = numPositions
			this.output(2).data = totalQuantity
			this.output(3).data = averagePrice

			// Write memory.
			if (exited) {
				memory.cleanup()
				return
			}
			memory.averagePrice = averagePrice
			memory.numPositions = numPositions
			memory.totalQuantity = totalQuantity
		} else {
			// No mediation added.

			const exited = exitMediation({ direction, averagePrice: averagePriceInMemory, percentageGain, price })

			// Set outputs.
			this.output(0).data = exited
			this.output(1).data = numPositionsInMemory
			this.output(2).data = totalQuantityInMemory
			this.output(3).data = averagePriceInMemory

			// Write memory.
			if (exited) {
				memory.cleanup()
				return
			}
		}
	}
}

export class MediatorShort extends DflowNode {
	static kind = 'mediatorShort'
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: MediatorDirection = 'SHORT'
		const price = this.input(0).data as number
		const quantity = this.input(1).data as number | undefined
		const percentageGain = this.input(2).data as number
		const memoryLabel = this.input(3).data as string | undefined
		const resetMediation = this.input(4).data

		const context = this.host.context as Context
		const memory = new MediatorMemory(context, memoryLabel)

		if (resetMediation) {
			memory.cleanup()
			return this.clearOutputs()
		}

		// Read memory.
		const {
			averagePrice: averagePriceInMemory,
			numPositions: numPositionsInMemory,
			totalQuantity: totalQuantityInMemory
		} = memory

		if (quantity) {
			// Add mediation.
			const {
				averagePrice,
				numPositions,
				totalQuantity
			} = addMediation({
				quantity,
				price,
				percentageGain,
				averagePrice: averagePriceInMemory,
				numPositions: numPositionsInMemory,
				totalQuantity: totalQuantityInMemory
			})

			const exited = exitMediation({ direction, averagePrice, percentageGain, price })

			// Set outputs.
			this.output(0).data = exited
			this.output(1).data = numPositions
			this.output(2).data = totalQuantity
			this.output(3).data = averagePrice

			// Write memory.
			if (exited) {
				memory.cleanup()
				return
			}
			memory.averagePrice = averagePrice
			memory.numPositions = numPositions
			memory.totalQuantity = totalQuantity
		} else {
			// No mediation added.

			const exited = exitMediation({ direction, averagePrice: averagePriceInMemory, percentageGain, price })

			// Set outputs.
			this.output(0).data = exited
			this.output(1).data = numPositionsInMemory
			this.output(2).data = totalQuantityInMemory
			this.output(3).data = averagePriceInMemory

			// Write memory.
			if (exited) {
				memory.cleanup()
				return
			}
		}
	}
}
