import { BinanceClient } from "../dist/client.js"

const apiKey = process.env.BINANCE_API_KEY
const apiSecret = process.env.BINANCE_API_SECRET
const binanceProxy = process.env.BINANCE_PROXY_BASE_URL

const binance = new BinanceClient(apiKey, apiSecret, binanceProxy)

const symbol = "BTCTUSD"
const side = "BUY"
const type = "MARKET"
const orderOptions = { quantity: "0.001" }

const order = await binance.newOrder(symbol, side, type, orderOptions)
console.log(order)
