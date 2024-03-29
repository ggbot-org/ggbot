/* eslint-disable sort-keys */
import { BinanceExchangeInfo } from "@workspace/binance"

export const exchangeInfo: BinanceExchangeInfo = {
	timezone: "UTC",
	serverTime: 1661290003214,
	rateLimits: [
		{
			rateLimitType: "REQUEST_WEIGHT",
			interval: "MINUTE",
			intervalNum: 1,
			limit: 1200
		},
		{
			rateLimitType: "ORDERS",
			interval: "SECOND",
			intervalNum: 10,
			limit: 50
		},
		{
			rateLimitType: "ORDERS",
			interval: "DAY",
			intervalNum: 1,
			limit: 160000
		},
		{
			rateLimitType: "RAW_REQUESTS",
			interval: "MINUTE",
			intervalNum: 5,
			limit: 6100
		}
	],
	symbols: [
		{
			symbol: "ETHBTC",
			status: "TRADING",
			baseAsset: "ETH",
			baseAssetPrecision: 8,
			quoteAsset: "BTC",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			quoteCommissionPrecision: 8,
			orderTypes: [
				"LIMIT",
				"LIMIT_MAKER",
				"MARKET",
				"STOP_LOSS_LIMIT",
				"TAKE_PROFIT_LIMIT"
			],
			icebergAllowed: true,
			ocoAllowed: true,
			quoteOrderQtyMarketAllowed: true,
			allowTrailingStop: true,
			cancelReplaceAllowed: true,
			isSpotTradingAllowed: true,
			isMarginTradingAllowed: true,
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.00000100",
					maxPrice: "922327.00000000",
					tickSize: "0.00000100"
				},
				{
					filterType: "PERCENT_PRICE",
					multiplierUp: "5",
					multiplierDown: "0.2",
					avgPriceMins: 5
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00010000",
					maxQty: "100000.00000000",
					stepSize: "0.00010000"
				},
				{
					filterType: "MIN_NOTIONAL",
					minNotional: "0.00010000",
					applyToMarket: true,
					avgPriceMins: 5
				},
				{ filterType: "ICEBERG_PARTS", limit: 10 },
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "1201.84537855",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{ filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
				{ filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
			],
			permissions: ["SPOT", "MARGIN", "TRD_GRP_004"]
		},
		{
			symbol: "BNBBTC",
			status: "TRADING",
			baseAsset: "BNB",
			baseAssetPrecision: 8,
			quoteAsset: "BTC",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			quoteCommissionPrecision: 8,
			orderTypes: [
				"LIMIT",
				"LIMIT_MAKER",
				"MARKET",
				"STOP_LOSS_LIMIT",
				"TAKE_PROFIT_LIMIT"
			],
			icebergAllowed: true,
			ocoAllowed: true,
			quoteOrderQtyMarketAllowed: true,
			allowTrailingStop: true,
			cancelReplaceAllowed: true,
			isSpotTradingAllowed: true,
			isMarginTradingAllowed: true,
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.00000100",
					maxPrice: "100000.00000000",
					tickSize: "0.00000100"
				},
				{
					filterType: "PERCENT_PRICE",
					multiplierUp: "5",
					multiplierDown: "0.2",
					avgPriceMins: 5
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00100000",
					maxQty: "100000.00000000",
					stepSize: "0.00100000"
				},
				{
					filterType: "MIN_NOTIONAL",
					minNotional: "0.00010000",
					applyToMarket: true,
					avgPriceMins: 5
				},
				{ filterType: "ICEBERG_PARTS", limit: 10 },
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "6804.34364816",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{ filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
				{ filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
			],
			permissions: ["SPOT", "MARGIN", "TRD_GRP_004"]
		},
		{
			symbol: "BNBETH",
			status: "TRADING",
			baseAsset: "BNB",
			baseAssetPrecision: 8,
			quoteAsset: "ETH",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			quoteCommissionPrecision: 8,
			orderTypes: [
				"LIMIT",
				"LIMIT_MAKER",
				"MARKET",
				"STOP_LOSS_LIMIT",
				"TAKE_PROFIT_LIMIT"
			],
			icebergAllowed: true,
			ocoAllowed: true,
			quoteOrderQtyMarketAllowed: true,
			allowTrailingStop: true,
			cancelReplaceAllowed: true,
			isSpotTradingAllowed: true,
			isMarginTradingAllowed: true,
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.00010000",
					maxPrice: "1000.00000000",
					tickSize: "0.00010000"
				},
				{
					filterType: "PERCENT_PRICE",
					multiplierUp: "5",
					multiplierDown: "0.2",
					avgPriceMins: 5
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00100000",
					maxQty: "9000000.00000000",
					stepSize: "0.00100000"
				},
				{
					filterType: "MIN_NOTIONAL",
					minNotional: "0.00500000",
					applyToMarket: true,
					avgPriceMins: 5
				},
				{ filterType: "ICEBERG_PARTS", limit: 10 },
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "4049.36397226",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{ filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
				{ filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
			],
			permissions: ["SPOT", "MARGIN", "TRD_GRP_004"]
		},
		{
			symbol: "BNBETH",
			status: "TRADING",
			baseAsset: "BNB",
			baseAssetPrecision: 8,
			quoteAsset: "ETH",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			quoteCommissionPrecision: 8,
			orderTypes: [
				"LIMIT",
				"LIMIT_MAKER",
				"MARKET",
				"STOP_LOSS_LIMIT",
				"TAKE_PROFIT_LIMIT"
			],
			icebergAllowed: true,
			ocoAllowed: true,
			quoteOrderQtyMarketAllowed: true,
			allowTrailingStop: true,
			cancelReplaceAllowed: true,
			isSpotTradingAllowed: true,
			isMarginTradingAllowed: true,
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.00010000",
					maxPrice: "1000.00000000",
					tickSize: "0.00010000"
				},
				{
					filterType: "PERCENT_PRICE",
					multiplierUp: "5",
					multiplierDown: "0.2",
					avgPriceMins: 5
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00100000",
					maxQty: "9000000.00000000",
					stepSize: "0.00100000"
				},
				{
					filterType: "MIN_NOTIONAL",
					minNotional: "0.00500000",
					applyToMarket: true,
					avgPriceMins: 5
				},
				{ filterType: "ICEBERG_PARTS", limit: 10 },
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "4049.36397226",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{ filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
				{ filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
			],
			permissions: ["SPOT", "MARGIN", "TRD_GRP_004"]
		},
		{
			symbol: "BTCBUSD",
			status: "TRADING",
			baseAsset: "BTC",
			baseAssetPrecision: 8,
			quoteAsset: "BUSD",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			quoteCommissionPrecision: 8,
			orderTypes: [
				"LIMIT",
				"LIMIT_MAKER",
				"MARKET",
				"STOP_LOSS_LIMIT",
				"TAKE_PROFIT_LIMIT"
			],
			icebergAllowed: true,
			ocoAllowed: true,
			quoteOrderQtyMarketAllowed: true,
			allowTrailingStop: true,
			cancelReplaceAllowed: true,
			isSpotTradingAllowed: true,
			isMarginTradingAllowed: true,
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.01000000",
					maxPrice: "1000000.00000000",
					tickSize: "0.01000000"
				},
				{
					filterType: "PERCENT_PRICE",
					multiplierUp: "5",
					multiplierDown: "0.2",
					avgPriceMins: 5
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00001000",
					maxQty: "9000.00000000",
					stepSize: "0.00001000"
				},
				{
					filterType: "MIN_NOTIONAL",
					minNotional: "10.00000000",
					applyToMarket: true,
					avgPriceMins: 5
				},
				{ filterType: "ICEBERG_PARTS", limit: 10 },
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "122.34284289",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{ filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
				{ filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
			],
			permissions: ["SPOT", "MARGIN", "TRD_GRP_004"]
		},
		{
			symbol: "ETHBUSD",
			status: "TRADING",
			baseAsset: "ETH",
			baseAssetPrecision: 8,
			quoteAsset: "BUSD",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			quoteCommissionPrecision: 8,
			orderTypes: [
				"LIMIT",
				"LIMIT_MAKER",
				"MARKET",
				"STOP_LOSS_LIMIT",
				"TAKE_PROFIT_LIMIT"
			],
			icebergAllowed: true,
			ocoAllowed: true,
			quoteOrderQtyMarketAllowed: true,
			allowTrailingStop: true,
			cancelReplaceAllowed: true,
			isSpotTradingAllowed: true,
			isMarginTradingAllowed: true,
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.01000000",
					maxPrice: "100000.00000000",
					tickSize: "0.01000000"
				},
				{
					filterType: "PERCENT_PRICE",
					multiplierUp: "5",
					multiplierDown: "0.2",
					avgPriceMins: 5
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00010000",
					maxQty: "90000.00000000",
					stepSize: "0.00010000"
				},
				{
					filterType: "MIN_NOTIONAL",
					minNotional: "10.00000000",
					applyToMarket: true,
					avgPriceMins: 5
				},
				{ filterType: "ICEBERG_PARTS", limit: 10 },
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "2602.04069376",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{ filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
				{ filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
			],
			permissions: ["SPOT", "MARGIN", "TRD_GRP_004"]
		},
		{
			symbol: "BNBBUSD",
			status: "TRADING",
			baseAsset: "BNB",
			baseAssetPrecision: 8,
			quoteAsset: "BUSD",
			quotePrecision: 8,
			quoteAssetPrecision: 8,
			baseCommissionPrecision: 8,
			quoteCommissionPrecision: 8,
			orderTypes: [
				"LIMIT",
				"LIMIT_MAKER",
				"MARKET",
				"STOP_LOSS_LIMIT",
				"TAKE_PROFIT_LIMIT"
			],
			icebergAllowed: true,
			ocoAllowed: true,
			quoteOrderQtyMarketAllowed: true,
			allowTrailingStop: true,
			cancelReplaceAllowed: true,
			isSpotTradingAllowed: true,
			isMarginTradingAllowed: true,
			filters: [
				{
					filterType: "PRICE_FILTER",
					minPrice: "0.10000000",
					maxPrice: "100000.00000000",
					tickSize: "0.10000000"
				},
				{
					filterType: "PERCENT_PRICE",
					multiplierUp: "5",
					multiplierDown: "0.2",
					avgPriceMins: 5
				},
				{
					filterType: "LOT_SIZE",
					minQty: "0.00100000",
					maxQty: "900000.00000000",
					stepSize: "0.00100000"
				},
				{
					filterType: "MIN_NOTIONAL",
					minNotional: "10.00000000",
					applyToMarket: true,
					avgPriceMins: 5
				},
				{ filterType: "ICEBERG_PARTS", limit: 10 },
				{
					filterType: "MARKET_LOT_SIZE",
					minQty: "0.00000000",
					maxQty: "19538.31395281",
					stepSize: "0.00000000"
				},
				{
					filterType: "TRAILING_DELTA",
					minTrailingAboveDelta: 10,
					maxTrailingAboveDelta: 2000,
					minTrailingBelowDelta: 10,
					maxTrailingBelowDelta: 2000
				},
				{ filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
				{ filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 }
			],
			permissions: ["SPOT", "MARGIN", "TRD_GRP_004"]
		}
	]
}
