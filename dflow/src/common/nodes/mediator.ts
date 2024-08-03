import { Dflow, DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../context.js"

const { input, output } = Dflow

const inputs = [
	input([], { name: "addPosition" }),
	input("string", { name: "memoryLabel", optional: true }),
	input("number", { name: "marketPrice" }),
	input([], { name: "resetMediation", optional: true })
]

const outputs = [
	output("boolean", { name: "exitMediation" }),
	output("number", { name: "numPositions" })
]

const mediatorDirections = ["LONG", "SHORT"] as const
type MediatorDirection = (typeof mediatorDirections)[number]

export type MediatorInput = {
	direction: MediatorDirection
	addPosition: unknown
	numPositions: unknown
}

export type MediatorOutput = {
	exitMediation: boolean
	numPositions: number
}

export function mediation ({
	numPositions: currentNumPositions,
	addPosition
}: MediatorInput): MediatorOutput {
	const numPositions = typeof currentNumPositions === "number" ? currentNumPositions : 0
	return {
		exitMediation: false,
		numPositions: addPosition ? numPositions + 1 : numPositions
	}
}

class Memory {
	readonly context: Context
	readonly memoryKey: {
		numPositions: string
	}
	constructor(context:Context, memoryLabel?:string) {
		this.context=context
		this.memoryKey = {
			numPositions: memoryLabel? `mediator:numPositions:${memoryLabel}`:"mediator:numPositions"
		}
	}
	get numPositions () {
		return this.context.memory[this.memoryKey.numPositions] as number
	}
	set numPositions (value: number) {
		this.context.memoryChanged = true
		this.context.memory[this.memoryKey.numPositions] = value
	}
	cleanup() {
		delete this.context.memory[this.memoryKey.numPositions]
		this.context.memoryChanged = true
	}
}

export class MediatorLong extends DflowNode {
	static kind = "mediatorLong"
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: MediatorDirection = "LONG"
		const addPosition = this.input(0).data
		const memoryLabel = this.input(1).data as string | undefined
		const marketPrice = this.input(2).data as number
		const resetMediation = this.input(3).data

		if (!addPosition || !marketPrice) return this.clearOutputs()

		const context = this.host.context as Context
		const memory = new Memory(context, memoryLabel)

		if (resetMediation) {
			memory.cleanup()
			return
		}

		// Read memory.
		const numPositionsInMemory = memory.numPositions

		// Compute mediation.
		const { numPositions, exitMediation } = mediation({
			direction,
			addPosition,
			numPositions: numPositionsInMemory
		})
		this.output(0).data = exitMediation
		this.output(1).data = numPositions

		// Write memory.
		if (exitMediation) {
			memory.cleanup()
			return
		}
		if (numPositions !== numPositionsInMemory) {
			memory.numPositions = numPositions
		}
	}
}

export class MediatorShort extends DflowNode {
	static kind = "mediatorShort"
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: MediatorDirection = "SHORT"
		const addPosition = this.input(0).data
		const memoryLabel = this.input(1).data as string | undefined
		const marketPrice = this.input(2).data as number
		const resetMediation = this.input(3).data

		if (!addPosition || !marketPrice) return this.clearOutputs()

		const context = this.host.context as Context
		const memory = new Memory(context, memoryLabel)

		if (resetMediation) {
			memory.cleanup()
			return
		}

		// Read memory.
		const numPositionsInMemory = memory.numPositions

		// Compute mediation.
		const { numPositions, exitMediation } = mediation({
			direction,
			addPosition,
			numPositions: numPositionsInMemory
		})
		this.output(0).data = exitMediation
		this.output(1).data = numPositions

		// Write memory.
		if (exitMediation) {
			memory.cleanup()
			return
		}
		if (numPositions !== numPositionsInMemory) {
			memory.numPositions = numPositions
		}
	}
}
