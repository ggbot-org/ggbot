import { isDecimal } from "@ggbot2/arithmetic";
import { isLiteralType } from "@ggbot2/models";

import {
  BinanceBalance,
  BinanceFill,
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceOrderRespACK,
  BinanceOrderRespFULL,
  BinanceOrderRespRESULT,
  BinanceOrderRespType,
  BinanceOrderSide,
  BinanceOrderStatus,
  BinanceOrderType,
  BinancePermission,
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
  binanceKlineIntervals,
  binanceKlineMaxLimit,
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
  isLiteralType<BinancePermission>(binancePermissions);

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

export const isBinanceKlineInterval = isLiteralType<BinanceKlineInterval>(
  binanceKlineIntervals
);

export const isBinanceKlineOptionalParameters = (
  arg: unknown
): arg is BinanceKlineOptionalParameters => {
  if (typeof arg !== "object" || arg === null) return false;
  const { startTime, endTime, limit } =
    arg as Partial<BinanceKlineOptionalParameters>;
  // If a parameter is defined it must be a number.
  if (startTime !== undefined && typeof startTime !== "number") return false;
  if (endTime !== undefined && typeof endTime !== "number") return false;
  if (limit !== undefined && typeof limit !== "number") return false;
  // `startTime` must preceed `endTime`.
  if (typeof startTime === "number" && typeof endTime === "number")
    if (startTime > endTime) return false;
  if (typeof startTime === "number" && typeof endTime === "number") return true;
  // `limit` is position and below its threeshold.
  if (typeof limit === "number")
    return limit > 0 && limit <= binanceKlineMaxLimit;
  // TODO also need to check that startTime and endTime is below
  // limit threeshold? If yes, will need the interval as param.
  return false;
};

export const isBinanceSymbolStatus = isLiteralType<BinanceSymbolStatus>(
  binanceSymbolStatuses
);

export const isBinanceTimeInForce =
  isLiteralType<BinanceTimeInForce>(binanceTimeInForces);
