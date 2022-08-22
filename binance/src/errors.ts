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
