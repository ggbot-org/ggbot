import { BinanceOrder } from "@workspace/binance"

export const orderBuyBTCBUSD1: BinanceOrder = {
	symbol: "BTCBUSD",
	orderId: 6906110758,
	transactTime: 1667846175202,
	price: "0.00000000",
	executedQty: "0.00096000",
	status: "FILLED",
	type: "MARKET",
	side: "BUY",
	fills: [
		{
			price: "20711.32000000",
			qty: "0.00096000",
			commission: "0.00000000",
			commissionAsset: "BNB",
		}
	]
}

// TODO add this to tests
// export const orderBuyBTCBUSD2: BinanceOrderRespFULL = {
// 	symbol: "BTCBUSD",
// 	orderId: 7506933426,
// 	orderListId: -1,
// 	clientOrderId: "A3moGC31ojDIqfamn9FJ4k",
// 	transactTime: 1670574597662,
// 	price: "0.00000000",
// 	origQty: "0.00100000",
// 	executedQty: "0.00100000",
// 	cummulativeQuoteQty: "17.20633830",
// 	status: "FILLED",
// 	timeInForce: "GTC",
// 	type: "MARKET",
// 	side: "BUY",
// 	fills: [
// 		{
// 			price: "17206.17000000",
// 			qty: "0.00001000",
// 			commission: "0.00000000",
// 			commissionAsset: "BNB",
// 			tradeId: 679379090
// 		},
// 		{
// 			price: "17206.34000000",
// 			qty: "0.00099000",
// 			commission: "0.00000000",
// 			commissionAsset: "BNB",
// 			tradeId: 679379091
// 		}
// 	]
// }
