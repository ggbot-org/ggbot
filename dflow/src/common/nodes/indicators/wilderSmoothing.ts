import {
  Decimal,
  coerceToDecimal,
  decimalToNumber,
  add,
  div,
  sub,
  maxNumOfDecimals,
} from "@ggbot2/arithmetic";
import { MovingAverage } from "./movingAverages.js";

export const wilderSmoothing: MovingAverage = (values, period) => {
  const size = values.length;
  if (size < period) return [];
  const numDecimals = maxNumOfDecimals(values);
  const decimalValues = values.map((value) =>
    coerceToDecimal(value, numDecimals)
  );
  const sum = decimalValues
    .slice(0, period)
    .reduce<Decimal>((a, b) => add(a, b), "0");
  const decimalOutputs: Decimal[] = [div(sum, period)];
  for (let i = period; i < size; i++) {
    const previous = decimalOutputs[i - period];
    decimalOutputs.push(
      add(div(sub(decimalValues[i], previous), period), previous)
    );
  }
  return decimalOutputs.map((value) => decimalToNumber(value, numDecimals));
};
