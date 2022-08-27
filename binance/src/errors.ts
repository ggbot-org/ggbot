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
  constructor(value: unknown) {
    super(`Invalid Binance order side ${value}`);
  }
}

export class ErrorInvalidBinanceOrderType extends Error {
  constructor(value: unknown) {
    super(`Invalid Binance order type ${value}`);
  }
}

export class ErrorInvalidBinanceSymbol extends Error {
  constructor(value: unknown) {
    super(`Invalid Binance symbol ${value}`);
  }
}
