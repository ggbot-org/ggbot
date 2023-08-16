import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils"

import { Account, AccountKey, isAccountKey } from "./account.js"
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { isItemId, Item, newId, NewItem, nullId } from "./item.js"
import { isName, Name, normalizeName } from "./name.js"
import { createdNow, CreationTime, DeletionTime, UpdateTime } from "./time.js"

const noneStrategyKind = "_none_"
export const strategyKinds = ["binance", noneStrategyKind] as const
export type StrategyKind = (typeof strategyKinds)[number]
export const isStrategyKind = isLiteralType<StrategyKind>(strategyKinds)

export type Strategy = Item &
	CreationTime &
	AccountKey & {
		readonly kind: StrategyKind
		name: Name
	}

export const isStrategy = objectTypeGuard<Strategy>(
	({ id, name, kind, ...accountKey }) =>
		isItemId(id) &&
		isAccountKey(accountKey) &&
		isStrategyKind(kind) &&
		isName(name)
)

export const noneStrategyKey: StrategyKey = {
	strategyId: nullId,
	strategyKind: noneStrategyKind
}

export const noneStrategy: Strategy = {
	id: nullId,
	kind: noneStrategyKind,
	name: "",
	whenCreated: 0,
	accountId: nullId
} as const

export const newStrategy = ({
	accountId,
	kind,
	name
}: NewItem<Strategy>): Strategy => ({
	accountId,
	id: newId(),
	kind,
	name: normalizeName(name),
	...createdNow()
})

export type StrategyKey = Readonly<{
	strategyId: Strategy["id"]
	strategyKind: Strategy["kind"]
}>

export const isStrategyKey = objectTypeGuard<StrategyKey>(
	({ strategyId, strategyKind }) =>
		isItemId(strategyId) && isStrategyKind(strategyKind)
)

export type CopyStrategyInput = AccountStrategyKey & Pick<Strategy, "name">

export const isCopyStrategyInput = objectTypeGuard<CopyStrategyInput>(
	({ name, ...accountStrategyKey }) =>
		isAccountStrategyKey(accountStrategyKey) && isName(name)
)

export type CopyStrategy = (arg: CopyStrategyInput) => Promise<Strategy>

export type CreateStrategyInput = NewItem<Strategy>

export const isCreateStrategyInput = objectTypeGuard<CreateStrategyInput>(
	(arg) => isStrategy({ ...arg, id: nullId, whenCreated: 1 })
)

export type CreateStrategy = (arg: NewItem<Strategy>) => Promise<Strategy>

export type ListStrategyKeysInput = Pick<StrategyKey, "strategyKind"> & {
	strategyId: string
}

/**
 * Input `StrategyKey` has `strategyKind` and maybe truncated `strategyId`.
 *
 * @example Get all strategies with strategyId starting with 'a'.
 *
 * ```json
 * {
 * 	"strategyKind": "binance",
 * 	"strategyId": "a"
 * }
 * ```
 */
export type ListStrategyKeys = (
	arg: ListStrategyKeysInput
) => Promise<StrategyKey[]>

export type ReadStrategy = (arg: StrategyKey) => Promise<Strategy | null>

export const isReadStrategyInput = isStrategyKey

export type ReadStrategyAccountId = (
	arg: StrategyKey
) => Promise<Account["id"] | null>

export type RenameStrategyInput = AccountStrategyKey & Pick<Strategy, "name">

export const isRenameStrategyInput = objectTypeGuard<RenameStrategyInput>(
	({ name, ...accountStrategyKey }) =>
		isName(name) && isAccountStrategyKey(accountStrategyKey)
)

export type RenameStrategy = (arg: RenameStrategyInput) => Promise<UpdateTime>

export type DeleteStrategy = (arg: AccountStrategyKey) => Promise<DeletionTime>

export const isDeleteStrategyInput = isAccountStrategyKey
