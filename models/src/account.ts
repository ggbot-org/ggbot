import { objectTypeGuard } from 'minimal-type-guard-helpers'

import { EmailAddress } from './email.js'
import { isItemId, Item, ItemKey, newId, NewItem } from './item.js'
import { Subscription } from './subscription.js'
import { createdNow, CreationTime } from './time.js'

type AccountRole = 'admin' | 'user'

export type Account = Item &
	CreationTime & {
		email: EmailAddress
	} & Partial<{
		/** The account role, defaults to "user" if omitted. */
		role: AccountRole
	}>

export type AccountInfo = Account & { subscription: Subscription | null }

export function newAccount({ email }: NewItem<Account>): Account {
	return { id: newId(), email, ...createdNow() }
}

export type AccountKey = ItemKey<'accountId', { accountId: Account['id'] }>

export const isAccountKey = objectTypeGuard<AccountKey>(({ accountId }) => isItemId(accountId))
