import { DflowBinanceSymbolInfo } from "@workspace/dflow"

const symbolInfoMap = new Map<string, DflowBinanceSymbolInfo>()

/** Get `symbolInfo` from cache map or look for it in `binanceSymbols`. */
export function getBinanceSymbolInfo(
	symbol: string,
	binanceSymbols: DflowBinanceSymbolInfo[] | undefined
) {
	const hasSymbolInfo = symbolInfoMap.has(symbol)
	const symbolInfo = hasSymbolInfo
		? symbolInfoMap.get(symbol)
		: binanceSymbols?.find(
				(binanceSymbol) => binanceSymbol.symbol === symbol
			)
	if (!hasSymbolInfo && symbolInfo) symbolInfoMap.set(symbol, symbolInfo)
	return symbolInfo
}
