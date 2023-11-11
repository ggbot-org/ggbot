import { add, mul, sub } from "@workspace/arithmetic"
import {
	balanceIsNotEmpty,
	BinanceOrderRespFULL,
	isBinanceOrderRespFULL
} from "@workspace/binance"
import { Balance } from "@workspace/models"
import { DflowGraphExecutionReport } from "dflow"

import { dflowBinanceZero as zero } from "./arithmetic.js"
import { BuyMarket, orderOutputPosition, SellMarket } from "./nodes/trade.js"
import { DflowBinanceSymbolInfo } from "./symbols.js"

export const getBalancesFromExecutionSteps = (
	binanceSymbols: DflowBinanceSymbolInfo[],
	steps: DflowGraphExecutionReport["steps"]
): Balance[] => {
	const orders = getOrdersFromExecutionSteps(steps)
	const balanceMap = new Map<string, Balance>()
	for (const { side, type, symbol, executedQty, fills } of orders) {
		const symbolInfo = binanceSymbols.find((info) => info.symbol === symbol)
		if (!symbolInfo) continue
		const { baseAsset, quoteAsset } = symbolInfo
		const baseBalance = balanceMap.get(symbol) ?? {
			asset: baseAsset,
			free: zero,
			locked: zero
		}
		const quoteBalance = balanceMap.get(symbol) ?? {
			asset: quoteAsset,
			free: zero,
			locked: zero
		}
		if (type === "MARKET") {
			if (side === "BUY") {
				balanceMap.set(baseAsset, {
					...baseBalance,
					free: add(baseBalance.free, executedQty)
				})
			}
			if (side === "SELL") {
				balanceMap.set(baseAsset, {
					...baseBalance,
					free: sub(baseBalance.free, executedQty)
				})
			}
		}
		for (const { commission, commissionAsset, qty, price } of fills) {
			const commissionBalance = balanceMap.get(commissionAsset) ?? {
				asset: commissionAsset,
				free: sub(zero, commission),
				locked: zero
			}
			if (type === "MARKET") {
				const quoteQuantity = mul(qty, price)
				if (side === "BUY") {
					balanceMap.set(quoteAsset, {
						...quoteBalance,
						free: sub(quoteBalance.free, quoteQuantity)
					})
				}
				if (side === "SELL") {
					balanceMap.set(quoteAsset, {
						...quoteBalance,
						free: add(quoteBalance.free, quoteQuantity)
					})
				}
				// Commissions.
				if (balanceIsNotEmpty(commissionBalance))
					balanceMap.set(commissionAsset, {
						...commissionBalance,
						free: sub(commissionBalance.free, commission)
					})
			}
		}
	}
	return Array.from(balanceMap.values())
}

export const getOrdersFromExecutionSteps = (
	steps: DflowGraphExecutionReport["steps"]
): BinanceOrderRespFULL[] =>
	steps.reduce<BinanceOrderRespFULL[]>((result, { k: kind, o: outputs }) => {
		if (![BuyMarket.kind, SellMarket.kind].includes(kind)) return result
		if (!Array.isArray(outputs)) return result
		const order = outputs[orderOutputPosition].d
		if (!isBinanceOrderRespFULL(order)) return result
		return [...result, order]
	}, [])
