import { BinanceOrderType, BinanceSymbolFilter } from "./types.js";

export class ErrorBinanceCannotTradeSymbol extends Error {
  static message = "Binance cannot trade this symbol";
  readonly symbol: unknown;
  readonly orderType: BinanceOrderType;
  constructor({
    symbol,
    orderType,
  }: Pick<ErrorBinanceCannotTradeSymbol, "symbol" | "orderType">) {
    super(ErrorBinanceCannotTradeSymbol.message);
    this.symbol = symbol;
    this.orderType = orderType;
  }
}

export class ErrorBinanceInvalidArg extends Error {
  static message = "Invalid Binance argument";
  arg: unknown;
  type: "klineInterval" | "orderType" | "orderSide" | "symbol";
  constructor({ arg, type }: Pick<ErrorBinanceInvalidArg, "arg" | "type">) {
    super(ErrorBinanceInvalidArg.message);
    this.arg = arg;
    this.type = type;
  }
}

export class ErrorBinanceSymbolFilter extends Error {
  filterType: BinanceSymbolFilter["filterType"];
  static message(filterType: ErrorBinanceSymbolFilter["filterType"]) {
    return `Binance filter ${filterType} violated`;
  }
  constructor({ filterType }: Pick<ErrorBinanceSymbolFilter, "filterType">) {
    super(ErrorBinanceSymbolFilter.message(filterType));
    this.filterType = filterType;
  }
}

export class ErrorBinanceInvalidOrderOptions extends Error {
  static message = "Invalid Binance order options";
  constructor() {
    super(ErrorBinanceInvalidOrderOptions.message);
  }
}

export class ErrorBinanceInvalidKlineOptionalParameters extends Error {
  static message = "Invalid kline optional parameters";
  constructor() {
    super(ErrorBinanceInvalidKlineOptionalParameters.message);
  }
}
