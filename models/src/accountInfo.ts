import { Account } from "./account.js"
import { Subscription } from "./subscription.js"

/** Group information about account, to be used client side. */
export type AccountInfo = Account & {
	subscription: Subscription | null
}
