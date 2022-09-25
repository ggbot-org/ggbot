import { ErrorCannotConvertToDecimal } from "./errors.js";

/**
 * Represents a number with decimal digits as a string.
 * Exponential notation is not allowed.
 */
export type Decimal = string;

export const canBeDecimal = (arg: unknown): arg is Decimal => {
  const n = Number(arg);
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
  const mantissaNum = Number(`0.${mantissa}`);
  if (mantissaNum === 0) return 0;
  return String(mantissaNum).length - 2;
};

/**
 * @throws {ErrorCannotConvertToDecimal}
 */
export const coerceToDecimal = (
  value: unknown,
  numDecimals?: number
): Decimal => {
  if (!canBeDecimal(value)) throw new ErrorCannotConvertToDecimal(value);
  const n = Number(value);
  return typeof numDecimals === "undefined"
    ? String(n)
    : n.toFixed(numDecimals);
};
