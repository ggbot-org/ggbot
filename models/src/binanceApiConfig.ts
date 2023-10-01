import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey, isAccountKey } from "./account.js"
import { ItemKey } from "./item.js"
import { isNonEmptyString, NonEmptyString } from "./strings.js"
import { CreationTime, DeletionTime } from "./time.js"

export type BinanceApiConfig = ItemKey<{
	apiKey: NonEmptyString
	apiSecret: NonEmptyString
}>

export const isBinanceApiConfig = objectTypeGuard<BinanceApiConfig>(
	({ apiKey, apiSecret }) =>
		isNonEmptyString(apiKey) && isNonEmptyString(apiSecret)
)

/**
 * BinanceApiKeyPermissionCriteria defines a set of conditions that validate if
 * a Binance API key can be used with ggbot2. It is important to notice that
 * withdrawals MUST not be enabled for security reasons.
 */
export type BinanceApiKeyPermissionCriteria = {
	enableReading: boolean
	enableSpotAndMarginTrading: boolean
	enableWithdrawals: boolean
	ipRestrict: boolean
}

type CreateBinanceApiConfigInput = AccountKey & BinanceApiConfig

export const isCreateBinanceApiConfigInput =
	objectTypeGuard<CreateBinanceApiConfigInput>(
		({ apiKey, apiSecret, ...accountKey }) =>
			isAccountKey(accountKey) &&
			isBinanceApiConfig({ apiKey, apiSecret })
	)

export type CreateBinanceApiConfig = (
	arg: CreateBinanceApiConfigInput
) => Promise<CreationTime>

export type ReadBinanceApiConfig = (
	arg: AccountKey
) => Promise<BinanceApiConfig | null>

/**
 * To be used to display BinanceApiConfig client-side, the `apiSecret` is
 * omitted and `apiKey` may be truncated.
 */
export type BinanceApiKey = Pick<BinanceApiConfig, "apiKey">

export type ReadBinanceApiKey = (
	arg: AccountKey
) => Promise<BinanceApiKey | null>

export type DeleteBinanceApiConfig = (arg: AccountKey) => Promise<DeletionTime>

export type ReadBinanceApiKeyPermissions = (
	arg: AccountKey
) => Promise<BinanceApiKeyPermissionCriteria>
