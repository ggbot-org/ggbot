import { BinanceOrderType } from "./types.js";

export class ErrorBinanceCannotTradeSymbol extends Error {
  constructor(symbol: unknown, orderType: BinanceOrderType) {
    super(`Binance cannot trade symbol ${symbol} with orderType ${orderType}`);
    this.name = ErrorBinanceCannotTradeSymbol.name;
  }
}

export class ErrorInvalidBinanceOrderOptions extends Error {
  constructor() {
    super("Invalid Binance order options");
    this.name = ErrorInvalidBinanceOrderOptions.name;
  }
}

export class ErrorInvalidBinanceOrderSide extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance order side ${arg}`);
    this.name = ErrorInvalidBinanceOrderSide.name;
  }
}

export class ErrorInvalidBinanceOrderType extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance order type ${arg}`);
    this.name = ErrorInvalidBinanceOrderType.name;
  }
}

export class ErrorInvalidBinanceSymbol extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance symbol ${arg}`);
    this.name = ErrorInvalidBinanceSymbol.name;
  }
}

export class ErrorInvalidBinanceKlineInterval extends Error {
  constructor(arg: unknown) {
    super(`Invalid Binance kline interval ${arg}`);
    this.name = ErrorInvalidBinanceKlineInterval.name;
  }
}

export class ErrorInvalidBinanceKlineOptionalParameters extends Error {
  constructor() {
    super("Invalid Binance kline optional parameters");
    this.name = ErrorInvalidBinanceKlineOptionalParameters.name;
  }
}

export class ErrorUnhandledBinanceOrderType extends Error {
  constructor(type: unknown) {
    super(`Unhandled Binance order type ${type}`);
    this.name = ErrorUnhandledBinanceOrderType.name;
  }
}
