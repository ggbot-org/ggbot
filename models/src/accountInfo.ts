import { Account, AccountKey } from "./account.js"
import { BinanceApiKey } from "./binanceApiConfig.js"
import { Subscription } from "./subscription.js"

export type AccountInfo = Account & {
	binance: BinanceApiKey | null
	subscription: Subscription | null
}

export type ReadAccountInfo = (arg: AccountKey) => Promise<AccountInfo | null>
