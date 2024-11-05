import { BinanceClient } from "../BinanceClient.js"
import { apiKey, apiSecret } from "./apiKeys.js"

const binance = new BinanceClient(apiKey, apiSecret)

const apiRestrictions = await binance.apiRestrictions()
console.info(apiRestrictions)
