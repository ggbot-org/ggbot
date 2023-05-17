import { isDecimal } from "@ggbot2/arithmetic";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";

import {
  BinanceApiKeyPermission,
  BinanceBalance,
  BinanceFill,
  BinanceKline,
  BinanceKlineInterval,
  binanceKlineIntervals,
  binanceKlineMaxLimit,
  BinanceKlineOptionalParameters,
  BinanceOrderRespACK,
  BinanceOrderRespFULL,
  BinanceOrderRespRESULT,
  BinanceOrderRespType,
  binanceOrderRespTypes,
  BinanceOrderSide,
  binanceOrderSides,
  BinanceOrderStatus,
  binanceOrderStatuses,
  BinanceOrderType,
  binanceOrderTypes,
  BinancePermission,
  binancePermissions,
  BinanceRateLimitInterval,
  binanceRateLimitIntervals,
  BinanceRateLimitType,
  binanceRateLimitTypes,
  BinanceSymbolFilterLotSize,
  BinanceSymbolFilterMinNotional,
  BinanceSymbolStatus,
  binanceSymbolStatuses,
  BinanceTimeInForce,
  binanceTimeInForces,
} from "./types.js";

// TODO use objectTypeGuard for all type guards

export const isBinanceApiKeyPermission =
  objectTypeGuard<BinanceApiKeyPermission>(
    ({
      // TODO should I add also other fields?
      ipRestrict,
      enableWithdrawals,
      enableMargin,
      enableSpotAndMarginTrading,
    }) =>
      typeof ipRestrict === "boolean" &&
      typeof enableWithdrawals === "boolean" &&
      typeof enableMargin === "boolean" &&
      typeof enableSpotAndMarginTrading === "boolean"
  );

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

export const isBinanceKline = (arg: unknown): arg is BinanceKline => {
  if (!Array.isArray(arg)) return false;
  const [
    openTime,
    open,
    high,
    low,
    close,
    volume,
    closeTime,
    quoteVolume,
    numTrades,
    takerBaseVolume,
    takerQuoteVolume,
    _unusedField,
  ] = arg;

  return (
    typeof openTime === "number" &&
    typeof open === "string" &&
    typeof high === "string" &&
    typeof low === "string" &&
    typeof close === "string" &&
    typeof volume === "string" &&
    typeof closeTime === "number" &&
    typeof quoteVolume === "string" &&
    typeof numTrades === "number" &&
    typeof takerBaseVolume === "string" &&
    typeof takerQuoteVolume === "string"
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
  const startTimeIsNum = typeof startTime === "number";
  const endTimeIsNum = typeof endTime === "number";
  const limitIsNum = typeof limit === "number";
  // All parameters are optional.
  if ([startTime, endTime, limit].every((param) => param === undefined))
    return true;
  // If a parameter is defined it must be a number.
  if (startTime !== undefined && !startTimeIsNum) return false;
  if (endTime !== undefined && !endTimeIsNum) return false;
  if (limit !== undefined && !limitIsNum) return false;
  // If a parameter is number, it must be positive.
  if (startTimeIsNum && startTime < 0) return false;
  if (endTimeIsNum && endTime < 0) return false;
  if (limitIsNum && limit < 0) return false;
  // `startTime` must preceed `endTime`.
  if (startTimeIsNum && endTimeIsNum) if (startTime > endTime) return false;
  if (startTimeIsNum && endTimeIsNum) return true;
  // `limit` is below its threeshold.
  if (limitIsNum && limit > binanceKlineMaxLimit) return false;
  // TODO also need to check that `startTime` and `endTime` duration is below
  // limit threeshold? If yes, will need the interval as param.
  return true;
};

export const isBinanceSymbolStatus = isLiteralType<BinanceSymbolStatus>(
  binanceSymbolStatuses
);

export const isBinanceTimeInForce =
  isLiteralType<BinanceTimeInForce>(binanceTimeInForces);
