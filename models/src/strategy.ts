import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey, isAccountKey } from "./account.js"
import { Frequency, isFrequency } from "./frequency.js"
import { isItemId, Item, ItemKey, newId, NewItem, nullId } from "./item.js"
import { isName, Name } from "./name.js"
import { createdNow, CreationTime } from "./time.js"

const strategyKinds = ["binance", "none"] as const
export type StrategyKind = (typeof strategyKinds)[number]
const isStrategyKind = isLiteralType<StrategyKind>(strategyKinds)

export type Strategy = Item &
	CreationTime &
	AccountKey & {
		readonly kind: StrategyKind
		name: Name
		/**
		 * Optional scheduling frequency.
		 *
		 * When the strategy is scheduled, the first scheduling is write here to
		 * be used as suggestion when another user copies the strategy.
		 */
		frequency?: Frequency | undefined
	}

export const isStrategy = objectTypeGuard<Strategy>(
	({ id, kind, accountId, name, frequency }) => isItemId(id) &&
		isStrategyKind(kind) &&
		isAccountKey({ accountId }) &&
		isName(name) &&
		frequency === undefined
		? true
		: isFrequency(frequency)
)

export function newStrategy({ name, ...rest }: NewItem<Strategy>): Strategy {
	return {
		id: newId(),
		name,
		...rest,
		...createdNow()
	}
}

export type StrategyKey = ItemKey<{
	strategyId: Strategy["id"]
	strategyKind: Strategy["kind"]
}>

export const isStrategyKey = objectTypeGuard<StrategyKey>(
	({ strategyId, strategyKind }) => isItemId(strategyId) && isStrategyKind(strategyKind)
)

export const nullStrategyKey: StrategyKey = {
	strategyId: nullId,
	strategyKind: "none"
}
