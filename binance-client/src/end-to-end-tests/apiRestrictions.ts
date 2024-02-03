import { logging } from "@workspace/logging"

import { BinanceClient } from "../client.js"
import { apiKey, apiSecret } from "./apiKeys.js"

const { info, warn } = logging("e2e:apiRestrictions")

const binance = new BinanceClient(apiKey, apiSecret)

try {
	const apiRestrictions = await binance.apiRestrictions()
	info(apiRestrictions)
} catch (error) {
	warn(error)
}
