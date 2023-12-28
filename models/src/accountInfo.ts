import { Account, AccountKey } from "./account.js"
import { Subscription } from "./subscription.js"

type AccountInfo = Account & {
	subscription: Subscription | null
}

export type ReadAccountInfo = (arg: AccountKey) => Promise<AccountInfo | null>
