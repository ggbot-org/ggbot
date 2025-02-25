import { objectTypeGuard } from 'minimal-type-guard-helpers'

import { ItemKey } from './item.js'
import { isNonEmptyString, NonEmptyString } from './strings.js'

export type BinanceApiConfig = ItemKey<
	'apiKey' | 'apiSecret',
	{
		apiKey: NonEmptyString
		apiSecret: NonEmptyString
	}
>

export const isBinanceApiConfig = objectTypeGuard<BinanceApiConfig>(
	({ apiKey, apiSecret }) =>
		isNonEmptyString(apiKey) && isNonEmptyString(apiSecret)
)

/**
 * A set of conditions that validate if a Binance API key can be used.
 *
 * @remarks
 * It is important to notice that withdrawals MUST not be enabled for security reasons.
 */
export type BinanceApiKeyPermissionCriteria = {
	enableReading: boolean
	enableSpotAndMarginTrading: boolean
	enableWithdrawals: boolean
	ipRestrict: boolean
}
