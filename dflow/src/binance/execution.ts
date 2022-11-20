import { add, sub, mul } from "@ggbot2/arithmetic";
import { BinanceOrderRespFULL, isBinanceOrderRespFULL } from "@ggbot2/binance";
import type { Balance } from "@ggbot2/models";
import type { DflowGraphExecutionReport } from "dflow";
import { DflowBinanceSymbolInfo } from "./symbols.js";
import { BuyMarket, SellMarket, orderOutput } from "./nodes/trade.js";

export const getBalancesFromExecutionSteps = (
  binanceSymbols: DflowBinanceSymbolInfo[],
  steps: DflowGraphExecutionReport["steps"]
): Balance[] => {
  const orders = getOrdersFromExecutionSteps(steps);
  const balanceMap = new Map<string, Balance>();
  for (const { side, type, symbol, executedQty, fills } of orders) {
    const symbolInfo = binanceSymbols.find((info) => info.symbol === symbol);
    if (!symbolInfo) continue;
    const { baseAsset, quoteAsset } = symbolInfo;
    const baseBalance = balanceMap.get(symbol) ?? {
      asset: baseAsset,
      free: "0",
      locked: "0",
    };
    const quoteBalance = balanceMap.get(symbol) ?? {
      asset: quoteAsset,
      free: "0",
      locked: "0",
    };
    // TODO how to emulate other order types?
    if (type === "MARKET") {
      if (side === "BUY") {
        balanceMap.set(baseAsset, {
          ...baseBalance,
          free: add(baseBalance.free, executedQty),
        });
      }
      if (side === "SELL") {
        balanceMap.set(baseAsset, {
          ...baseBalance,
          free: sub(baseBalance.free, executedQty),
        });
      }
    }
    for (const { commission, commissionAsset, qty, price } of fills) {
      const commissionBalance = balanceMap.get(commissionAsset) ?? {
        asset: commission,
        free: "0",
        locked: "0",
      };
      // TODO how to emulate other order types?
      if (type === "MARKET") {
        const quoteQuantity = mul(qty, price);
        if (side === "BUY") {
          balanceMap.set(quoteAsset, {
            ...quoteBalance,
            free: sub(quoteBalance.free, quoteQuantity),
          });
        }
        if (side === "SELL") {
          balanceMap.set(quoteAsset, {
            ...quoteBalance,
            free: add(quoteBalance.free, quoteQuantity),
          });
        }
        // Commissions.
        balanceMap.set(commissionAsset, {
          ...commissionBalance,
          free: sub(commissionBalance.free, commission),
        });
      }
    }
  }
  return Array.from(balanceMap.values());
};

export const getOrdersFromExecutionSteps = (
  steps: DflowGraphExecutionReport["steps"]
): BinanceOrderRespFULL[] =>
  steps.reduce<BinanceOrderRespFULL[]>((result, { kind, outputs }) => {
    if (![BuyMarket.kind, SellMarket.kind].includes(kind)) return result;
    if (!Array.isArray(outputs)) return result;
    const order = outputs[0].data;
    if (!isBinanceOrderRespFULL(order)) return result;
    return [...result, order];
  }, []);
