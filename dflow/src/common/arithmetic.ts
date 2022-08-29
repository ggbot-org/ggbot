import {
  ErrorArithmeticOperationCannotDivideByZero,
  ErrorArithmeticOperationInvalidDecimal,
} from "../errors.js";

export type ArithmeticOperation = (a: Decimal, b: Decimal) => Decimal;

/**
 * Represents a number with decimal digits as a string.
 * Exponential notation is not allowed.
 */
export type Decimal = string;

export const isDecimal = (value: unknown): value is Decimal => {
  const n = Number(value);
  if (typeof n !== "number" || isNaN(n) || !Number.isFinite(n)) return false;
  return true;
};

export const decimalToNumber = (d: Decimal, numDecimals?: number) =>
  typeof numDecimals === "number"
    ? Number(Number(d).toFixed(numDecimals))
    : Number(d);

export const numOfDecimals = (n: Decimal) => {
  const [_integer, mantissa] = n.split(".");
  if (typeof mantissa !== "string") return 0;
  // Remove right padded zeros.
  //
  // Create a new number 0.{mantissa}
  // Convert it to string and subtract 2 (the length of '0.')
  //
  // For example:
  //     n = '1.23456789000'
  //     mantissa = '23456789000'
  //     Number 0.{mantissa} = 0.23456789
  return String(Number(`0.${mantissa}`)).length - 2;
};

const maxNumOfDecimals = (a: Decimal, b: Decimal): number =>
  Math.max(numOfDecimals(a), numOfDecimals(b));

/**
 * @throws {ErrorArithmeticOperationInvalidDecimal}
 */
export const coerceToDecimal = (
  value: unknown,
  numDecimals?: number
): Decimal => {
  if (!isDecimal(value))
    throw new ErrorArithmeticOperationInvalidDecimal(value);
  const n = Number(value);
  return typeof numDecimals === "undefined"
    ? String(n)
    : n.toFixed(numDecimals);
};

// Operators
// ///////////////////////////////////////////////////////////////////

export const equal = (a: Decimal, b: Decimal): boolean => {
  const numDecimals = maxNumOfDecimals(a, b);
  return Number(a).toFixed(numDecimals) === Number(b).toFixed(numDecimals);
};

export const add: ArithmeticOperation = (a, b) =>
  coerceToDecimal(Number(a) + Number(b), maxNumOfDecimals(a, b));

export const sub: ArithmeticOperation = (a, b) =>
  coerceToDecimal(Number(a) - Number(b), maxNumOfDecimals(a, b));

export const mul: ArithmeticOperation = (a, b) =>
  coerceToDecimal(Number(a) * Number(b), maxNumOfDecimals(a, b));

/**
 * @throws {ErrorArithmeticOperationCannotDivideByZero}
 */
export const div: ArithmeticOperation = (a, b) => {
  if (equal(b, coerceToDecimal(0, numOfDecimals(b))))
    throw new ErrorArithmeticOperationCannotDivideByZero();
  // The numOfDecimals is not preserved with division, for example
  //
  //     1 / 2 = 0.5
  //     ↑   ↑     ↑
  //     0   0 ->  1 numOfDecimals
  return coerceToDecimal(Number(a) / Number(b));
};
