import { Dflow, DflowNode } from "dflow"

import { DflowCommonContext as Context } from "../context.js"

const { input, output } = Dflow

const inputs = [
	input([], { name: "addPosition" }),
	input("string", { name: "memoryLabel" }),
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
	numPositionsInMemory: unknown
}

export type MediatorOutput = {
	exitMediation: boolean
	numPositions: number
}

export const mediation = ({
	numPositionsInMemory,
	addPosition
}: MediatorInput): MediatorOutput => {
	const numPositions =
		typeof numPositionsInMemory === "number" ? numPositionsInMemory : 0
	return {
		exitMediation: false,
		numPositions: addPosition ? numPositions + 1 : numPositions
	}
}

const mediatorMemoryKeys = (memoryLabel: string) => ({
	numPositionsMemoryKey: `mediator:numPositions:${memoryLabel}`
})

export class MediatorLong extends DflowNode {
	static kind = "mediatorLong"
	static inputs = inputs
	static outputs = outputs
	run() {
		const direction: MediatorDirection = "LONG"
		const addPosition = this.input(0).data
		const memoryLabel = this.input(1).data as string
		// const marketPrice = this.input(2).data as number
		const resetMediation = this.input(3).data

		const context = this.host.context as Context

		const { numPositionsMemoryKey } = mediatorMemoryKeys(memoryLabel)

		const cleanupMemory = () => {
			delete context.memory[numPositionsMemoryKey]
			context.memoryChanged = true
		}

		if (resetMediation) {
			cleanupMemory()
			return
		}

		// Read memory.
		const numPositionsInMemory = context.memory[numPositionsMemoryKey]

		// Compute mediation.
		const { numPositions, exitMediation } = mediation({
			direction,
			addPosition,
			numPositionsInMemory
		})
		this.output(0).data = exitMediation
		this.output(1).data = numPositions
		if (exitMediation) {
			cleanupMemory()
		} else if (numPositions !== numPositionsInMemory) {
			// Save next numPositions
			context.memoryChanged = true
			context.memory[numPositionsMemoryKey] = numPositions
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
		const memoryLabel = this.input(1).data as string
		// const marketPrice = this.input(2).data as number
		const resetMediation = this.input(3).data

		const context = this.host.context as Context

		const { numPositionsMemoryKey } = mediatorMemoryKeys(memoryLabel)

		const cleanupMemory = () => {
			delete context.memory[numPositionsMemoryKey]
			context.memoryChanged = true
		}

		if (resetMediation) {
			cleanupMemory()
			return
		}

		// Read memory.
		const numPositionsInMemory = context.memory[numPositionsMemoryKey]

		// Compute mediation.
		const { numPositions, exitMediation } = mediation({
			direction,
			addPosition,
			numPositionsInMemory
		})
		this.output(0).data = exitMediation
		this.output(1).data = numPositions
		if (exitMediation) {
			cleanupMemory()
		} else if (numPositions !== numPositionsInMemory) {
			// Save next numPositions
			context.memoryChanged = true
			context.memory[numPositionsMemoryKey] = numPositions
		}
	}
}
