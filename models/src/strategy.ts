import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { Account, AccountKey, isAccountKey } from "./account.js"
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { isItemId, Item, ItemKey, newId, NewItem } from "./item.js"
import { isName, Name, normalizeName } from "./name.js"
import { createdNow, CreationTime, DeletionTime, UpdateTime } from "./time.js"

const strategyKinds = ["binance"] as const
export type StrategyKind = (typeof strategyKinds)[number]
const isStrategyKind = isLiteralType<StrategyKind>(strategyKinds)

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

export type StrategyKey = ItemKey<{
	strategyId: Strategy["id"]
	strategyKind: Strategy["kind"]
}>

export const isStrategyKey = objectTypeGuard<StrategyKey>(
	({ strategyId, strategyKind }) =>
		isItemId(strategyId) && isStrategyKind(strategyKind)
)

type CopyStrategyInput = AccountStrategyKey & Pick<Strategy, "name">

export const isCopyStrategyInput = objectTypeGuard<CopyStrategyInput>(
	({ name, ...accountStrategyKey }) =>
		isAccountStrategyKey(accountStrategyKey) && isName(name)
)

export type CopyStrategy = (arg: CopyStrategyInput) => Promise<Strategy>

type CreateStrategyInput = NewItem<Strategy>

export const isCreateStrategyInput = objectTypeGuard<CreateStrategyInput>(
	(arg) => isStrategy({ ...arg, id: "00000000", whenCreated: 1 })
)

export type CreateStrategy = (arg: NewItem<Strategy>) => Promise<Strategy>

export type ReadStrategy = (arg: StrategyKey) => Promise<Strategy | null>

export const isReadStrategyInput = isStrategyKey

export type ReadStrategyAccountId = (
	arg: StrategyKey
) => Promise<Account["id"] | null>

type RenameStrategyInput = AccountStrategyKey & Pick<Strategy, "name">

export const isRenameStrategyInput = objectTypeGuard<RenameStrategyInput>(
	({ name, ...accountStrategyKey }) =>
		isName(name) && isAccountStrategyKey(accountStrategyKey)
)

export type RenameStrategy = (arg: RenameStrategyInput) => Promise<UpdateTime>

export type DeleteStrategy = (arg: AccountStrategyKey) => Promise<DeletionTime>

export const isDeleteStrategyInput = isAccountStrategyKey
