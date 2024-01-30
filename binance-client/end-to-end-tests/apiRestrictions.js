import { BinanceClient } from "../dist/client.js"

const apiKey = process.env.BINANCE_API_KEY
const apiSecret = process.env.BINANCE_API_SECRET

const binance = new BinanceClient(apiKey, apiSecret)

const apiRestrictions = await binance.apiRestrictions()
console.info(apiRestrictions)
