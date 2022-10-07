import { BinanceOrderType } from "./types.js";

export class ErrorBinanceCannotTradeSymbol extends Error {
  constructor(symbol: unknown, orderType: BinanceOrderType) {
    super(`Binance cannot trade symbol ${symbol} with orderType ${orderType}`);
  }
}

export class ErrorInvalidBinanceOrderOptions extends Error {
  constructor() {
    super("Invalid Binance order options");
  }
}

export class ErrorInvalidBinanceOrderSide extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance order side ${arg}`);
  }
}

export class ErrorInvalidBinanceOrderType extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance order type ${arg}`);
  }
}

export class ErrorInvalidBinanceSymbol extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance symbol ${arg}`);
  }
}

export class ErrorInvalidBinanceKlineInterval extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance kline interval ${arg}`);
  }
}

export class ErrorInvalidBinanceKlineOptionalParameters extends Error {
  constructor() {
    super("Invalid Binance kline optional parameters");
  }
}

export class ErrorUnhandledBinanceOrderType extends Error {
  constructor(type: unknown) {
    super(`Unhandled Binance order type ${type}`);
  }
}
