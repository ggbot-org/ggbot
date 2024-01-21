import { BinanceApiResponseOutput } from "@workspace/api"
import { BinanceApiPrivateEndpoint } from "@workspace/binance"
import { SerializableData } from "@workspace/models"

import { BinanceDataProvider } from "./binanceDataProvider.js"

export const binanceHandler = async (
	endpoint: BinanceApiPrivateEndpoint
): Promise<BinanceApiResponseOutput<SerializableData>> => {
	const apiKey = "TODO"
	const apiSecret = "TODO"
	const dataProvider = new BinanceDataProvider(apiKey, apiSecret)
	return dataProvider.action(endpoint)
}
