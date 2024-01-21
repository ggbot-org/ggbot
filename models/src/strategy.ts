import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { Account, AccountKey, isAccountKey } from "./account.js"
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { Frequency, isFrequency } from "./frequency.js"
import { isItemId, Item, ItemKey, newId, NewItem, nullId } from "./item.js"
import { isName, Name, normalizeName } from "./name.js"
import { createdNow, CreationTime, DeletionTime, UpdateTime } from "./time.js"

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
		 * be used as suggestion when another user clones the strategy.
		 */
		frequency?: Frequency | undefined
	}

export const isStrategy = objectTypeGuard<Strategy>(
	({ id, kind, accountId, name, frequency }) =>
		isItemId(id) &&
		isStrategyKind(kind) &&
		isAccountKey({ accountId }) &&
		isName(name) &&
		frequency === undefined
			? true
			: isFrequency(frequency)
)

export const newStrategy = ({
	name,
	...rest
}: NewItem<Strategy>): Strategy => ({
	id: newId(),
	name: normalizeName(name),
	...rest,
	...createdNow()
})

export type StrategyKey = ItemKey<{
	strategyId: Strategy["id"]
	strategyKind: Strategy["kind"]
}>

export const isStrategyKey = objectTypeGuard<StrategyKey>(
	({ strategyId, strategyKind }) =>
		isItemId(strategyId) && isStrategyKind(strategyKind)
)

export const nullStrategyKey: StrategyKey = {
	strategyId: nullId,
	strategyKind: "none"
}

type CopyStrategyInput = AccountStrategyKey & Pick<Strategy, "name">

export const isCopyStrategyInput = objectTypeGuard<CopyStrategyInput>(
	({ name, ...accountStrategyKey }) =>
		isAccountStrategyKey(accountStrategyKey) && isName(name)
)

export type CopyStrategy = (arg: CopyStrategyInput) => Promise<Strategy>

type CreateStrategyInput = NewItem<Strategy>

export const isCreateStrategyInput = objectTypeGuard<CreateStrategyInput>(
	(arg) => isStrategy({ ...arg, id: nullId, whenCreated: 1 })
)

export type CreateStrategy = (arg: NewItem<Strategy>) => Promise<Strategy>

export type ReadStrategyAccountId = (
	arg: StrategyKey
) => Promise<Account["id"] | null>

type RenameStrategyInput = AccountStrategyKey & Pick<Strategy, "name">

export const isRenameStrategyInput = objectTypeGuard<RenameStrategyInput>(
	({ name, ...accountStrategyKey }) =>
		isName(name) && isAccountStrategyKey(accountStrategyKey)
)

export type RenameStrategy = (arg: RenameStrategyInput) => Promise<UpdateTime>

type UpsertStrategyFrequencyInput = StrategyKey & { frequency: Frequency }

export type UpsertStrategyFrequency = (
	arg: UpsertStrategyFrequencyInput
) => Promise<void>

type DeleteStrategyInput = AccountStrategyKey

export const isDeleteStrategyInput = objectTypeGuard<DeleteStrategyInput>(
	({ ...accountStrategyKey }) => isAccountStrategyKey(accountStrategyKey)
)

export type DeleteStrategy = (arg: DeleteStrategyInput) => Promise<DeletionTime>
