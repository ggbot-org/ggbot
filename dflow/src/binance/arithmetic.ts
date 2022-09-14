import {
  ArithmeticOperation,
  add,
  sub,
  mul,
  div,
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

export const binanceAdd: ArithmeticOperation = (a, b) =>
  add(a, b, binanceWantedPrecision);

export const binanceDiv: ArithmeticOperation = (a, b) =>
  div(a, b, binanceWantedPrecision);

export const binanceMul: ArithmeticOperation = (a, b) =>
  mul(a, b, binanceWantedPrecision);

export const binanceSub: ArithmeticOperation = (a, b) =>
  sub(a, b, binanceWantedPrecision);
