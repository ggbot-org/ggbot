import { arrayTypeGuard, objectTypeGuard } from 'minimal-type-guard-helpers'

import { isItemId, Item, newId } from './item.js'
import { isScheduling, Scheduling } from './scheduling.js'
import { isStrategyMemory, StrategyMemory } from './strategyMemory.js'
import {
	isStrategyParameters,
	StrategyParameters,
} from './strategyParameters.js'

export type StrategyScheduling = Item &
	Scheduling & {
		params?: StrategyParameters
		memory?: StrategyMemory
	}

export const isStrategyScheduling = objectTypeGuard<StrategyScheduling>(
	({ id, memory, params, ...scheduling }) =>
		isItemId(id) &&
		isScheduling(scheduling) &&
		(params === undefined ? true : isStrategyParameters(params)) &&
		(memory === undefined ? true : isStrategyMemory(memory))
)

export function newStrategyScheduling({
	frequency,
	status,
}: Pick<StrategyScheduling, 'frequency' | 'status'>): StrategyScheduling {
	return { id: newId(), frequency, status }
}

export const isStrategySchedulings =
	arrayTypeGuard<StrategyScheduling>(isStrategyScheduling)
