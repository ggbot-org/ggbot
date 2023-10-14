import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"

import { isItemId, Item, newId } from "./item.js"
import { isScheduling, Scheduling } from "./scheduling.js"
import { isStrategyInput, StrategyInput } from "./strategyInput.js"
import { isStrategyMemory, StrategyMemory } from "./strategyMemory.js"

export type StrategyScheduling = Item &
	Scheduling & {
		input?: StrategyInput
		memory?: StrategyMemory
	}

export const isStrategyScheduling = objectTypeGuard<StrategyScheduling>(
	({ id, input, memory, ...scheduling }) =>
		isItemId(id) && isScheduling(scheduling) && input === undefined
			? true
			: isStrategyInput(input) && memory === undefined
			? true
			: isStrategyMemory(memory)
)

export const newStrategyScheduling = ({
	frequency,
	status
}: Pick<StrategyScheduling, "frequency" | "status">): StrategyScheduling => ({
	id: newId(),
	frequency,
	status
})

export const isStrategySchedulings =
	arrayTypeGuard<StrategyScheduling>(isStrategyScheduling)
