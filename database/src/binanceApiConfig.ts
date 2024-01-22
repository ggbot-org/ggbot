import { UserApiDataProviderOperation as Operation } from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import { AccountKey, BinanceApiConfig, createdNow } from "@workspace/models"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

const binanceApiConfigCache = new CacheMap<BinanceApiConfig>()

export const createBinanceApiConfig: Operation["CreateBinanceApiConfig"] =
	async ({ accountId, apiKey, apiSecret }) => {
		await WRITE(pathname.binanceApiConfig({ accountId }), {
			apiKey,
			apiSecret
		})
		return createdNow()
	}

type ReadBinanceApiConfig = (
	arg: AccountKey
) => Promise<BinanceApiConfig | null>

export const readBinanceApiConfig: ReadBinanceApiConfig = async ({
	accountId
}) => {
	const cachedData = binanceApiConfigCache.get(accountId)
	if (cachedData) return cachedData
	const data = await READ<ReadBinanceApiConfig>(
		pathname.binanceApiConfig({ accountId })
	)
	if (!data) return null
	binanceApiConfigCache.set(accountId, data)
	return data
}

export const readBinanceApiKey: Operation["ReadBinanceApiKey"] = async ({
	accountId
}) => {
	const data = await readBinanceApiConfig({ accountId })
	if (!data) return null
	const { apiKey } = data
	return { apiKey }
}

export const deleteBinanceApiConfig: Operation["DeleteBinanceApiConfig"] = (
	arg
) => DELETE(pathname.binanceApiConfig(arg))
