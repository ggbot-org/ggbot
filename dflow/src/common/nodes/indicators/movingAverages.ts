import {
  Decimal,
  add,
  coerceToDecimal,
  decimalToNumber,
  div,
  maxNumOfDecimals,
  mul,
  sub,
} from "@ggbot2/arithmetic";
import { DflowNode } from "dflow";
import {
  inputPeriod,
  inputValues,
  outputLastValue,
  outputValues,
} from "../commonIO.js";

export type MovingAverage = (values: number[], period: number) => number[];

const movingAverageInputs = [inputValues, inputPeriod];

const movingAverageOutputs = [outputValues, outputLastValue];

export const exponentialMovingAverage: MovingAverage = (values, period) => {
  const size = values.length;
  if (size < period) return [];
  const numDecimals = maxNumOfDecimals(values);
  const decimalValues = values.map((value) =>
    coerceToDecimal(value, numDecimals)
  );
  const decimalOutputs: Decimal[] = [decimalValues[0]];
  for (let i = 1; i < size; i++) {
    const previous = decimalOutputs[i - 1];
    decimalOutputs.push(
      add(mul(sub(decimalValues[i], previous), 2 / (period + 1)), previous)
    );
  }
  return decimalOutputs.map((value) => decimalToNumber(value, numDecimals));
};

export class ExponentialMovingAverage extends DflowNode {
  static kind = "EMA";
  static inputs = movingAverageInputs;
  static outputs = movingAverageOutputs;
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = exponentialMovingAverage(values, period);
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}

export const simpleMovingAverage: MovingAverage = (values, period) => {
  if (values.length < period) return [];
  return values.reduce<number[]>((result, _value, index, array) => {
    if (index < period - 1) return result;
    const movingValues = array.slice(index - period + 1, index + 1);
    const numDecimals = maxNumOfDecimals(movingValues);
    const sum = movingValues
      .map((value) => coerceToDecimal(value, numDecimals))
      .reduce<Decimal>((a, b) => add(a, b), "0");
    const average = div(sum, coerceToDecimal(period));
    return result.concat(decimalToNumber(average, numDecimals));
  }, []);
};

export class SimpleMovingAverage extends DflowNode {
  static kind = "SMA";
  static inputs = movingAverageInputs;
  static outputs = movingAverageOutputs;
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = simpleMovingAverage(values, period);
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}

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

export class WilderMovingAverage extends DflowNode {
  static kind = "WilderMA";
  static inputs = movingAverageInputs;
  static outputs = movingAverageOutputs;
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = wilderSmoothing(values, period);
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}
