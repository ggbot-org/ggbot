import { CacheMap } from "@workspace/cache"
import {
	CreateBinanceApiConfig,
	DeleteBinanceApiConfig,
	ReadBinanceApiConfig,
	ReadBinanceApiKey
} from "@workspace/api"
import {
	BinanceApiConfig,
	createdNow,
} from "@workspace/models"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
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
