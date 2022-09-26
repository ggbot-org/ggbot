import {
  Decimal,
  MaybeDecimal,
  coerceToDecimal,
  maxNumOfDecimals,
  numOfDecimals,
} from "./decimal.js";
import { ErrorCannotDivideByZero } from "./errors.js";

export type ArithmeticOperator = (
  a: MaybeDecimal,
  b: MaybeDecimal,
  numDecimals?: number
) => Decimal;

export const equal = (a: MaybeDecimal, b: MaybeDecimal): boolean => {
  const numDecimals = maxNumOfDecimals([a, b]);
  return Number(a).toFixed(numDecimals) === Number(b).toFixed(numDecimals);
};

export const add: ArithmeticOperator = (a, b, numDecimals) =>
  coerceToDecimal(
    Number(a) + Number(b),
    numDecimals ?? maxNumOfDecimals([a, b])
  );

export const sub: ArithmeticOperator = (a, b, numDecimals) =>
  coerceToDecimal(
    Number(a) - Number(b),
    numDecimals ?? maxNumOfDecimals([a, b])
  );

export const mul: ArithmeticOperator = (a, b, numDecimals) =>
  coerceToDecimal(
    Number(a) * Number(b),
    numDecimals ?? maxNumOfDecimals([a, b])
  );

/**
 * @throws {ErrorArithmeticOperatorCannotDivideByZero}
 */
export const div: ArithmeticOperator = (a, b, numDecimals) => {
  if (equal(b, coerceToDecimal(0, numOfDecimals(b))))
    throw new ErrorCannotDivideByZero();
  // Cannot use `maxNumOfDecimals` 'cause the `numOfDecimals` is
  // not preserved with division, for example
  //
  //     1 / 2 = 0.5
  //     ↑   ↑     ↑
  //     0   0 ->  1 numOfDecimals
  //
  return coerceToDecimal(Number(a) / Number(b), numDecimals);
};
