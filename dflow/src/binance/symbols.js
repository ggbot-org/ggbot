	/** @type {import('./symbols').binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols} */
export function binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(symbols) {
	return symbols
		.filter(({ isSpotTradingAllowed }) => isSpotTradingAllowed)
		.map(
			({
				baseAsset,
				baseAssetPrecision,
				baseCommissionPrecision,
				filters,
				isSpotTradingAllowed,
				quoteAsset,
				quoteAssetPrecision,
				status,
				symbol
			}) => ({
				baseAsset,
				baseAssetPrecision,
				baseCommissionPrecision,
				filters,
				isSpotTradingAllowed,
				quoteAsset,
				quoteAssetPrecision,
				status,
				symbol,
			})
		)
}

	/** @type {import('./symbols').dflowBinanceSymbolSeparator} */
export const dflowBinanceSymbolSeparator = '/'

	/** @type {import('./symbols').getDflowBinanceNodeSymbolKind} */
export function getDflowBinanceNodeSymbolKind({ baseAsset, quoteAsset }) {
	return [baseAsset, quoteAsset].join(dflowBinanceSymbolSeparator)
}
