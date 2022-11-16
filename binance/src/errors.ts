import { BinanceOrderType } from "./types.js";

export class ErrorBinanceCannotTradeSymbol extends Error {
  readonly symbol: unknown;
  readonly orderType: BinanceOrderType;
  constructor(symbol: unknown, orderType: BinanceOrderType) {
    super("Binance cannot trade this symbol");
    this.name = ErrorBinanceCannotTradeSymbol.name;
    this.symbol = symbol;
    this.orderType = orderType;
  }
}

// TODO replace all other errors with this generic one
export class ErrorBinanceInvalidArg extends Error {
  arg: unknown;
  type: "BinanceOrderType" | "BinanceOrderSide";
  constructor({ arg, type }: Pick<ErrorBinanceInvalidArg, "arg" | "type">) {
    super("Invalid Binance argument");
    this.name = ErrorBinanceInvalidArg.name;
    this.arg = arg;
    this.type = type;
  }
}

export class ErrorInvalidBinanceOrderOptions extends Error {
  constructor() {
    super("Invalid Binance order options");
    this.name = ErrorInvalidBinanceOrderOptions.name;
  }
}

export class ErrorInvalidBinanceOrderSide extends Error {
  readonly arg: unknown;
  constructor(arg: unknown) {
    super(`Invalid Binance order side ${arg}`);
    this.name = ErrorInvalidBinanceOrderSide.name;
  }
}

export class ErrorInvalidBinanceOrderType extends Error {
  readonly arg: unknown;
  constructor(arg: unknown) {
    super(`Invalid Binance order type ${arg}`);
    this.name = ErrorInvalidBinanceOrderType.name;
  }
}

export class ErrorInvalidBinanceSymbol extends Error {
  readonly arg: unknown;
  constructor(arg: unknown) {
    super(`Invalid Binance symbol ${arg}`);
    this.name = ErrorInvalidBinanceSymbol.name;
  }
}

export class ErrorInvalidBinanceKlineInterval extends Error {
  readonly arg: unknown;
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
