import { BinanceOrderType } from "./types.js";

export class ErrorBinanceCannotTradeSymbol extends Error {
  static message = "Binance cannot trade this symbol";
  readonly symbol: unknown;
  readonly orderType: BinanceOrderType;
  constructor({
    symbol,
    orderType,
  }: Pick<ErrorBinanceCannotTradeSymbol, "symbol" | "orderType">) {
    super(ErrorBinanceCannotTradeSymbol.message);
    this.name = ErrorBinanceCannotTradeSymbol.name;
    this.symbol = symbol;
    this.orderType = orderType;
  }
}

export class ErrorBinanceInvalidArg extends Error {
  static message = "Invalid Binance argument";
  arg: unknown;
  type: "kilneInterval" | "orderType" | "orderSide" | "symbol";
  constructor({ arg, type }: Pick<ErrorBinanceInvalidArg, "arg" | "type">) {
    super(ErrorBinanceInvalidArg.message);
    this.name = ErrorBinanceInvalidArg.name;
    this.arg = arg;
    this.type = type;
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
