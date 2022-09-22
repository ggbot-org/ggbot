import {
  ArithmeticOperator,
  Decimal,
  coerceToDecimal,
  decimalToNumber,
  add,
  div,
  mul,
  sub,
} from "@ggbot2/arithmetic";

/**
Most of the Binance symbols has precision 8. Others are edge case markets.
In `binance.exchangeInfo()`` response, there are over 2000 symbols with values
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
export const dflowBinancePrecision = 8;

export const binanceCoerceToDecimal = (arg: unknown) =>
  coerceToDecimal(arg, dflowBinancePrecision);

export const binanceDecimalToNumber = (arg: Decimal) =>
  decimalToNumber(arg, dflowBinancePrecision);

export const binanceAdd: ArithmeticOperator = (a, b) =>
  add(a, b, dflowBinancePrecision);

export const binanceDiv: ArithmeticOperator = (a, b) =>
  div(a, b, dflowBinancePrecision);

export const binanceMul: ArithmeticOperator = (a, b) =>
  mul(a, b, dflowBinancePrecision);

export const binanceSub: ArithmeticOperator = (a, b) =>
  sub(a, b, dflowBinancePrecision);
