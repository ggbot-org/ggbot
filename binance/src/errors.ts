import { BinanceOrderType, BinanceSymbolFilter } from "./types.js";

export class ErrorBinanceBadRequest extends Error {
  static errorName = "ErrorBinanceBadRequest";
  static message({
    status,
    statusText,
    url,
  }: Pick<Response, "status" | "statusText" | "url">) {
    return `Server responded with status=${status} statusText=${statusText} on URL=${url}`;
  }
  pathname: string;
  constructor(response: Response) {
    super(ErrorBinanceBadRequest.message(response));
    const url = new URL(response.url);
    // Hide search params, which contains signature, and host which may point to BINANCE_PROXY_BASE_URL.
    this.pathname = url.pathname;
  }
  toObject() {
    return {
      name: ErrorBinanceBadRequest.errorName,
      info: {
        pathname: this.pathname,
      },
    };
  }
}

export class ErrorBinanceCannotTradeSymbol extends Error {
  static errorName = "ErrorBinanceCannotTradeSymbol";
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
  static errorName = "ErrorBinanceInvalidArg";
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
  static errorName = ErrorBinanceSymbolFilter;
  static message(filterType: ErrorBinanceSymbolFilter["filterType"]) {
    return `Binance filter ${filterType} violated`;
  }
  filterType: BinanceSymbolFilter["filterType"];
  constructor({ filterType }: Pick<ErrorBinanceSymbolFilter, "filterType">) {
    super(ErrorBinanceSymbolFilter.message(filterType));
    this.filterType = filterType;
  }
}

export class ErrorBinanceInvalidOrderOptions extends Error {
  static errorName = "ErrorBinanceInvalidOrderOptions";
  static message = "Invalid Binance order options";
  constructor() {
    super(ErrorBinanceInvalidOrderOptions.message);
  }
}

export class ErrorBinanceInvalidKlineOptionalParameters extends Error {
  static errorName = "ErrorBinanceInvalidKlineOptionalParameters";
  static message = "Invalid kline optional parameters";
  constructor() {
    super(ErrorBinanceInvalidKlineOptionalParameters.message);
  }
}
