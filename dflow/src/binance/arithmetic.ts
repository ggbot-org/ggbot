import {
  ArithmeticOperation,
  add as _add,
  sub as _sub,
  mul as _mul,
  div as _div,
} from "../common/arithmetic.js";

/**
Most of the Binance symbols has precision 8. Others are edge case markets.
In binance.exchangeInfo() response there are over 2000 symbols with values
```json
{
  "baseAssetPrecision": 8,
  "baseCommissionPrecision": 8,
  "quoteAssetPrecision": 8,
  "quoteCommissionPrecision": 8,
  "quotePrecision": 8,
}
```
*/
export const binanceWantedPrecision = 8;

export const add: ArithmeticOperation = (a, b) =>
  _add(a, b, binanceWantedPrecision);

export const div: ArithmeticOperation = (a, b) =>
  _div(a, b, binanceWantedPrecision);

export const mul: ArithmeticOperation = (a, b) =>
  _mul(a, b, binanceWantedPrecision);

export const sub: ArithmeticOperation = (a, b) =>
  _sub(a, b, binanceWantedPrecision);
