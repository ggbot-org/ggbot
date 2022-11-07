import { isDecimal } from "@ggbot2/arithmetic";
import { isLiteralType } from "@ggbot2/models";

import {
  BinanceBalance,
  BinanceFill,
  BinanceKlineOptionalParameters,
  BinanceOrderRespACK,
  BinanceOrderRespFULL,
  BinanceOrderRespRESULT,
  BinanceOrderRespType,
  BinanceOrderSide,
  BinanceOrderStatus,
  BinanceOrderType,
  BinancePermissions,
  BinanceRateLimitInterval,
  BinanceRateLimitType,
  BinanceSymbolFilterLotSize,
  BinanceSymbolFilterMinNotional,
  BinanceSymbolStatus,
  BinanceTimeInForce,
  binanceOrderRespTypes,
  binanceOrderSides,
  binanceOrderStatuses,
  binanceOrderTypes,
  binancePermissions,
  binanceRateLimitIntervals,
  binanceRateLimitTypes,
  binanceSymbolStatuses,
  binanceTimeInForces,
} from "./types.js";

export const isBinanceBalance = (arg: unknown): arg is BinanceBalance => {
  if (typeof arg !== "object" || arg === null) return false;
  const { asset, free, locked } = arg as Partial<BinanceBalance>;
  return typeof asset === "string" && isDecimal(free) && isDecimal(locked);
};

export const isBinanceFill = (arg: unknown): arg is BinanceFill => {
  if (typeof arg !== "object" || arg === null) return false;
  const { price, qty, commission, commissionAsset } =
    arg as Partial<BinanceFill>;
  return (
    isDecimal(price) &&
    isDecimal(qty) &&
    isDecimal(commission) &&
    typeof commissionAsset === "string"
  );
};

export const isBinanceOrderRespACK = (
  arg: unknown
): arg is BinanceOrderRespACK => {
  if (typeof arg !== "object" || arg === null) return false;
  const { symbol, orderId, orderListId, clientOrderId, transactTime } =
    arg as Partial<BinanceOrderRespACK>;
  return (
    typeof symbol === "string" &&
    typeof orderId === "number" &&
    typeof orderListId === "number" &&
    typeof clientOrderId === "string" &&
    typeof transactTime === "number"
  );
};

export const isBinanceOrderRespRESULT = (
  arg: unknown
): arg is BinanceOrderRespRESULT => {
  if (!isBinanceOrderRespACK(arg)) return false;
  const {
    price,
    origQty,
    executedQty,
    cummulativeQuoteQty,
    status,
    timeInForce,
    type,
    side,
  } = arg as Partial<BinanceOrderRespRESULT>;
  return (
    isDecimal(price) &&
    isDecimal(origQty) &&
    isDecimal(executedQty) &&
    isDecimal(cummulativeQuoteQty) &&
    isBinanceOrderStatus(status) &&
    isBinanceTimeInForce(timeInForce) &&
    isBinanceOrderType(type) &&
    isBinanceOrderSide(side)
  );
};

export const isBinanceOrderRespFULL = (
  arg: unknown
): arg is BinanceOrderRespFULL => {
  if (typeof arg !== "object" || arg === null) return false;
  const { fills } = arg as Partial<BinanceOrderRespFULL>;
  if (!Array.isArray(fills)) return false;
  return fills.every((fill) => isBinanceFill(fill));
};

export const isBinancePermission =
  isLiteralType<BinancePermissions>(binancePermissions);

export const isBinanceOrderStatus =
  isLiteralType<BinanceOrderStatus>(binanceOrderStatuses);

export const isBinanceOrderType =
  isLiteralType<BinanceOrderType>(binanceOrderTypes);

export const isBinanceRateLimitInterval =
  isLiteralType<BinanceRateLimitInterval>(binanceRateLimitIntervals);

export const isBinanceOrderRespType = isLiteralType<BinanceOrderRespType>(
  binanceOrderRespTypes
);

export const isBinanceOrderSide =
  isLiteralType<BinanceOrderSide>(binanceOrderSides);

export const isBinanceRateLimitType = isLiteralType<BinanceRateLimitType>(
  binanceRateLimitTypes
);

export const isBinanceSymbolFilterLotSize = (
  arg: unknown
): arg is BinanceSymbolFilterLotSize => {
  if (typeof arg !== "object" || arg === null) return false;
  const { filterType, minQty, maxQty, stepSize } =
    arg as Partial<BinanceSymbolFilterLotSize>;
  return (
    filterType === "LOT_SIZE" &&
    isDecimal(minQty) &&
    isDecimal(maxQty) &&
    isDecimal(stepSize)
  );
};

export const isBinanceSymbolFilterMinNotional = (
  arg: unknown
): arg is BinanceSymbolFilterMinNotional => {
  if (typeof arg !== "object" || arg === null) return false;
  const { filterType, minNotional, applyToMarket, avgPriceMins } =
    arg as Partial<BinanceSymbolFilterMinNotional>;
  return (
    filterType === "MIN_NOTIONAL" &&
    isDecimal(minNotional) &&
    typeof applyToMarket === "boolean" &&
    typeof avgPriceMins === "number"
  );
};

export const binanceKlineIntervals = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
] as const;
export type BinanceKlineInterval = typeof binanceKlineIntervals[number];
export const isBinanceKlineInterval = isLiteralType<BinanceKlineInterval>(
  binanceKlineIntervals
);

export const binanceKlineMaxLimit = 1000;

export const isBinanceKlineOptionalParameters = (
  arg: unknown
): arg is BinanceKlineOptionalParameters => {
  if (typeof arg !== "object" || arg === null) return false;
  const { startTime, endTime, limit } =
    arg as Partial<BinanceKlineOptionalParameters>;
  // If a parameter is defined it must be a number.
  if (typeof startTime !== "undefined" && typeof startTime !== "number")
    return false;
  if (typeof endTime !== "undefined" && typeof endTime !== "number")
    return false;
  if (typeof limit !== "undefined" && typeof limit !== "number") return false;
  // startTime must preceed endTime.
  if (typeof startTime === "number" && typeof endTime === "number") {
    if (startTime > endTime) return false;
  }
  if (typeof limit === "number") {
    return limit > 0 && limit <= binanceKlineMaxLimit;
  }
  return true;
};

export const isBinanceSymbolStatus = isLiteralType<BinanceSymbolStatus>(
  binanceSymbolStatuses
);

export const isBinanceTimeInForce =
  isLiteralType<BinanceTimeInForce>(binanceTimeInForces);
