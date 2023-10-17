import { BinanceClient } from "@workspace/binance-client"
import { readBinanceApiConfig } from "@workspace/database"
import { ENV } from "@workspace/env"
import {
	ErrorAccountItemNotFound,
	ReadBinanceApiKeyPermissions
} from "@workspace/models"

export const readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions =
	async ({ accountId }) => {
		const binanceApiConfig = await readBinanceApiConfig({ accountId })
		if (!binanceApiConfig)
			throw new ErrorAccountItemNotFound({
				type: "BinanceApiConfig",
				accountId
			})
		const { apiKey, apiSecret } = binanceApiConfig
		const binance = new BinanceClient(
			apiKey,
			apiSecret,
			ENV.BINANCE_PROXY_BASE_URL()
		)
		const data = await binance.apiRestrictions()
		return {
			enableReading: data.enableReading,
			enableSpotAndMarginTrading: data.enableSpotAndMarginTrading,
			ipRestrict: data.ipRestrict,
			enableWithdrawals: data.enableWithdrawals
		}
	}
