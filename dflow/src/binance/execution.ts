import {
	add,
	balanceIsNotEmpty,
	BinanceOrder,
	mul,
	sub,
} from '@workspace/binance'
import { Balance, BalanceItem } from '@workspace/models'
import { DflowExecutionReport } from 'dflow'

import { dflowBinanceZero as zero } from './arithmetic.js'
import { BuyMarket, orderOutputPosition, SellMarket } from './nodes/trade.js'
import { DflowBinanceSymbolInfo } from './symbols.js'

export function getBalanceFromExecutionSteps(
	binanceSymbols: DflowBinanceSymbolInfo[],
	steps: DflowExecutionReport['steps']
): Balance {
	const orders = getOrdersFromExecutionSteps(steps)
	const balanceMap = new Map<string, BalanceItem>()
	for (const { side, type, symbol, executedQty, fills } of orders) {
		const symbolInfo = binanceSymbols.find((info) => info.symbol === symbol)
		if (!symbolInfo) continue
		const { baseAsset, baseAssetPrecision, quoteAsset, quoteAssetPrecision } =
			symbolInfo
		const baseBalance = balanceMap.get(symbol) ?? {
			asset: baseAsset,
			free: zero(baseAssetPrecision),
			locked: zero(baseAssetPrecision),
		}
		const quoteBalance = balanceMap.get(symbol) ?? {
			asset: quoteAsset,
			free: zero(quoteAssetPrecision),
			locked: zero(quoteAssetPrecision),
		}
		if (type === 'MARKET') {
			if (side === 'BUY') {
				balanceMap.set(baseAsset, {
					...baseBalance,
					free: add(baseBalance.free, executedQty),
				})
			}
			if (side === 'SELL') {
				balanceMap.set(baseAsset, {
					...baseBalance,
					free: sub(baseBalance.free, executedQty),
				})
			}
		}
		for (const { commission, commissionAsset, qty, price } of fills) {
			const commissionBalance = balanceMap.get(commissionAsset) ?? {
				asset: commissionAsset,
				free: sub(zero(8), commission),
				locked: zero(8),
			}
			if (type === 'MARKET') {
				const quoteQuantity = mul(qty, price)
				if (side === 'BUY') {
					balanceMap.set(quoteAsset, {
						...quoteBalance,
						free: sub(quoteBalance.free, quoteQuantity),
					})
				}
				if (side === 'SELL') {
					balanceMap.set(quoteAsset, {
						...quoteBalance,
						free: add(quoteBalance.free, quoteQuantity),
					})
				}
				// Commissions.
				if (balanceIsNotEmpty(commissionBalance)) {
					balanceMap.set(commissionAsset, {
						...commissionBalance,
						free: sub(commissionBalance.free, commission),
					})
				}
			}
		}
	}
	return Array.from(balanceMap.values())
}

export function getOrdersFromExecutionSteps(
	steps: DflowExecutionReport['steps']
): BinanceOrder[] {
	return steps.reduce<BinanceOrder[]>((result, { k: kind, o: outputs }) => {
		if (![BuyMarket.kind, SellMarket.kind].includes(kind)) return result
		if (!Array.isArray(outputs)) return result
		const order = outputs[orderOutputPosition].d
		return [...result, order as BinanceOrder]
	}, [])
}
