import { BinanceExchangeInfoCacheProvider, BinanceKlinesCacheProvider } from "./cacheProviders.js"
import { BinanceConnector } from "./connector.js"
import { ErrorBinanceInvalidOrderOptions, ErrorBinanceSymbolFilter } from "./errors.js"
import { lotSizeIsValid, minNotionalIsValid } from "./symbolFilters.js"
import { getBinanceIntervalTime } from "./time.js"
import { isBinanceSymbolFilterLotSize, isBinanceSymbolFilterMinNotional } from "./typeGuards.js"
import { BinanceExchangeInfo, BinanceKline, BinanceKlineInterval, BinanceKlineOptionalParameters, BinanceNewOrderOptions, BinanceOrderType, BinanceSymbolFilterLotSize, BinanceSymbolFilterMinNotional, BinanceSymbolInfo, BinanceTicker24hr, BinanceTickerPrice } from "./types.js"

/**
 * BinanceExchange implements public API requests.
 *
 * It can use an `exchangeInfoCache` instance, that is any class implementing
 * `BinanceExchangeInfoCacheProvider`, for example
 * `BinanceExchangeInfoCacheMap`.
 *
 * It can use a `klinesCache` instance, that is any class implementing
 * `BinanceKlineInterval`, for example `BinanceKlinesCacheMap`.
 *
 * @example
 *
 * ```ts
 * import {
 * 	BinanceConnector,
 * 	BinanceExchange,
 * 	BinanceExchangeInfoCacheMap,
 * 	BinanceKlinesCacheMap
 * } from "@workspace/binance"
 *
 * const binance = new BinanceExchange(BinanceConnector.defaultBaseUrl)
 * binance.exchangeInfoCache = new BinanceExchangeInfoCacheMap()
 * binance.klinesCache = new BinanceKlinesCacheMap()
 * ```
 */
export class BinanceExchange {
	readonly connector: BinanceConnector

	exchangeInfoCache: BinanceExchangeInfoCacheProvider | undefined
	klinesCache: BinanceKlinesCacheProvider | undefined

	constructor(baseUrl?: string) {
		this.connector = new BinanceConnector(baseUrl)
	}

	static throwIfMinNotionalFilterIsInvalid(
		quoteOrderQty: NonNullable<BinanceNewOrderOptions["quoteOrderQty"]>,
		type: BinanceOrderType,
		minNotionalFilter?: BinanceSymbolFilterMinNotional
	) {
		if (minNotionalFilter === undefined) return
		if (type === "MARKET" && minNotionalFilter.applyToMarket !== true) return
		if (!minNotionalIsValid(minNotionalFilter, quoteOrderQty)) throw new ErrorBinanceSymbolFilter({
			filterType: "MIN_NOTIONAL",
			detail: `quoteOrderQty=${quoteOrderQty}`
		})
	}

	static throwIfLotSizeFilterIsInvalid(
		quantity: NonNullable<BinanceNewOrderOptions["quantity"]>,
		lotSizeFilter?: BinanceSymbolFilterLotSize
	) {
		if (lotSizeFilter && !lotSizeIsValid(lotSizeFilter, quantity)) {
			throw new ErrorBinanceSymbolFilter({
				filterType: "LOT_SIZE",
				detail: `quantity=${quantity}`
			})
		}
	}

	/**
	 * Validate order parameters and try to adjust them.
	 *
	 * @see {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
	 */
	async prepareOrder(
		symbol: string,
		orderType: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	): Promise<BinanceNewOrderOptions | undefined> {
		const symbolInfo = await this.symbolInfo(symbol)
		if (!symbolInfo) {
			console.error(`No info for Binance symbol ${symbol}.`)
			return
		}

		const { filters } = symbolInfo

		const lotSizeFilter = filters.find(isBinanceSymbolFilterLotSize)
		const minNotionalFilter = filters.find(isBinanceSymbolFilterMinNotional)

		const { quantity, quoteOrderQty } = orderOptions

		const prepareOptions: Record<typeof orderType, () => BinanceNewOrderOptions> = {
			MARKET: () => {
				if (quantity === undefined && quoteOrderQty === undefined) throw new ErrorBinanceInvalidOrderOptions()
				if (quantity) {
					BinanceExchange.throwIfLotSizeFilterIsInvalid(quantity, lotSizeFilter)
					return { quantity }
				}
				if (quoteOrderQty) {
					BinanceExchange.throwIfMinNotionalFilterIsInvalid(quoteOrderQty, orderType, minNotionalFilter)
				}
				return { quoteOrderQty }
			},
		}

		return prepareOptions[orderType]()
	}

	/**
	 * Current exchange trading rules and symbol information.
	 *
	 * @see {@link https://binance-docs.github.io/apidocs/spot/en/#exchange-information}
	 */
	async exchangeInfo(): Promise<BinanceExchangeInfo> {
		const { exchangeInfoCache: cache } = this
		const cached = await cache?.getExchangeInfo()
		if (cached) return cached
		// Get response and filter unnecessary data.
		const { serverTime, symbols } = await this.connector.request<BinanceExchangeInfo>("GET", "/api/v3/exchangeInfo")
		const data = {
			serverTime,
			symbols: symbols.map(({
				baseAsset, baseAssetPrecision, baseCommissionPrecision, filters, isSpotTradingAllowed, quoteAsset, quoteAssetPrecision, status, symbol
			}) => ({
				baseAsset, baseAssetPrecision, baseCommissionPrecision, filters, isSpotTradingAllowed, quoteAsset, quoteAssetPrecision, status, symbol
			})),
		} satisfies BinanceExchangeInfo
		await cache?.setExchangeInfo(data)
		return data
	}

	/**
	 * Kline/Candlestick Data.
	 *
	 * @see {@link https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data}
	 */
	async klines(symbol: string, interval: BinanceKlineInterval, optionalParameters: BinanceKlineOptionalParameters): Promise<BinanceKline[]> {
		// Look for cached data.
		const { klinesCache: cache } = this
		const cachedKlines: BinanceKline[] = []
		let someKlineNotFoundInCache = false
		const { limit } = optionalParameters
		let { startTime, endTime } = optionalParameters
		if (limit && startTime && !endTime) endTime = getBinanceIntervalTime[interval](startTime).plus(limit)
		if (limit && !startTime && endTime) startTime = getBinanceIntervalTime[interval](endTime).minus(limit)
		if (cache && startTime && endTime) {
			let time = startTime
			while (time < endTime) {
				const kline = await cache.getKline(symbol, interval, time)
				if (!kline) {
					someKlineNotFoundInCache = true
					break
				}
				cachedKlines.push(kline)
				time = getBinanceIntervalTime[interval](time).plus(1)
			}
			// If all klines found in cache, it's done!
			if (!someKlineNotFoundInCache) return cachedKlines
		}
		// If any data was not found in cache, fetch it from Binance API.
		const klines = await this.connector.request<BinanceKline[]>("GET", "/api/v3/klines", { symbol, interval, ...optionalParameters })
		// Cache all klines found.
		if (cache) for (const kline of klines) await cache.setKline(symbol, interval, kline)
		return klines
	}

	/** Get `BinanceSymbolInfo` for `symbol`, if any. */
	async symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
		const { symbols } = await this.exchangeInfo()
		return symbols.find((info) => info.symbol === symbol)
	}

	/**
	 * 24 hour rolling window price change statistics.
	 *
	 * @see {@link https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics}
	 */
	async ticker24hr(symbol: string): Promise<BinanceTicker24hr> {
		return await this.connector.request<BinanceTicker24hr>("GET", "/api/v3/ticker/24hr", { symbol })
	}

	/**
	 * Latest price for a symbol.
	 *
	 * @see {@link https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker}
	 */
	async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
		return await this.connector.request<BinanceTickerPrice>("GET", "/api/v3/ticker/price", { symbol })
	}
}
