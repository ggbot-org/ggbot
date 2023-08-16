import { CacheMap } from "@ggbot2/cache"
import {
	BinanceApiConfig,
	CreateBinanceApiConfig,
	createdNow,
	DeleteBinanceApiConfig,
	ErrorAccountItemNotFound,
	isBinanceApiConfig,
	ReadBinanceApiConfig,
	ReadBinanceApiKey,
	ReadBinanceApiKeyPermissions
} from "@ggbot2/models"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
import { Binance } from "./binance.js"
import { pathname } from "./locators.js"

const binanceApiConfigCache = new CacheMap<BinanceApiConfig>()

export const createBinanceApiConfig: CreateBinanceApiConfig = async ({
	accountId,
	apiKey,
	apiSecret
}) => {
	await WRITE(pathname.binanceApiConfig({ accountId }), {
		apiKey,
		apiSecret
	})
	return createdNow()
}

export const readBinanceApiConfig: ReadBinanceApiConfig = async ({
	accountId
}) => {
	const cachedData = binanceApiConfigCache.get(accountId)
	if (cachedData) return cachedData
	const data = await READ<ReadBinanceApiConfig>(
		isBinanceApiConfig,
		pathname.binanceApiConfig({ accountId })
	)
	if (!data) return null
	binanceApiConfigCache.set(accountId, data)
	return data
}

export const readBinanceApiKey: ReadBinanceApiKey = async ({ accountId }) => {
	const data = await readBinanceApiConfig({ accountId })
	if (!data) return null
	const { apiKey } = data
	return { apiKey }
}

export const deleteBinanceApiConfig: DeleteBinanceApiConfig = (arg) =>
	DELETE(pathname.binanceApiConfig(arg))

export const readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions =
	async ({ accountId }) => {
		const binanceApiConfig = await readBinanceApiConfig({ accountId })
		if (!binanceApiConfig)
			throw new ErrorAccountItemNotFound({
				type: "BinanceApiConfig",
				accountId
			})
		const { apiKey, apiSecret } = binanceApiConfig
		const binance = new Binance(apiKey, apiSecret)
		return await binance.apiRestrictions()
	}
