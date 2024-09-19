
import { BinanceClient } from "../client.js"
import { apiKey, apiSecret } from "./apiKeys.js"

const binance = new BinanceClient(apiKey, apiSecret)

const symbol = "BTCTUSD"
const side = "BUY"
const type = "MARKET"
const orderOptions = { quantity: "0.001" }

const order = await binance.newOrder(symbol, side, type, orderOptions)
console.info(order)
