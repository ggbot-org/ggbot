import { binance } from '_/binance/exchange'
import { binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols, DflowBinanceSymbolInfo } from '@workspace/dflow'
import { StrategyKind } from '@workspace/models'
import { useEffect, useState } from 'react'

export function useBinanceSymbols(strategyKind: StrategyKind | undefined) {
	const [binanceSymbols, setBinanceSymbols] = useState<DflowBinanceSymbolInfo[] | undefined>()

	useEffect(() => {
		if (strategyKind !== 'binance') return
		binance.exchangeInfo().then(({ symbols }) => {
			setBinanceSymbols(
				binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(symbols)
			)
		}).catch((error) => console.error(error))
	}, [strategyKind])

	return binanceSymbols
}
