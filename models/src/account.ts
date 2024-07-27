import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { EmailAddress, isEmailAddress } from "./email.js"
import { isItemId, Item, ItemKey, newId, NewItem, nullId } from "./item.js"
import { Subscription } from "./subscription.js"
import { createdNow, CreationTime, isCreationTime } from "./time.js"

const accountRoles = ["admin", "user"] as const
type AccountRole = (typeof accountRoles)[number]
const isAccountRole = isLiteralType<AccountRole>(accountRoles)

export type Account = Item &
	CreationTime & {
		email: EmailAddress
	} & Partial<{
		/** The account role, defaults to "user" if omitted. */
		role: AccountRole
	}>

export const isAccount = objectTypeGuard<Account>(
	({ id, email, role, ...creationTime }) =>
		isItemId(id) &&
		isEmailAddress(email) &&
		isCreationTime(creationTime) &&
		(role === undefined ? true : isAccountRole(role))
)

export type AccountInfo = Account & { subscription: Subscription | null }

export function newAccount({ email }: NewItem<Account>): Account {
	return {
		...createdNow(),
		id: newId(),
		email
	}
}

export type AccountKey = ItemKey<{
	accountId: Account["id"]
}>

export const isAccountKey = objectTypeGuard<AccountKey>(({ accountId }) =>
	isItemId(accountId)
)

export const nullAccountKey: AccountKey = {
	accountId: nullId
}
