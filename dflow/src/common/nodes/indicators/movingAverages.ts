import {
  Decimal,
  add,
  coerceToDecimal,
  decimalToNumber,
  div,
  maxNumOfDecimals,
} from "@ggbot2/arithmetic";
import { DflowNode } from "dflow";
import {
  inputPeriod,
  inputValues,
  outputLastValue,
  outputValues,
} from "./commonIO.js";

export type MovingAverage = (values: number[], period: number) => number[];

const movingAverageInputs = [inputValues, inputPeriod];

const movingAverageOutputs = [outputValues, outputLastValue];

export const ema: MovingAverage = (values, period) => {
  if (values.length < period) return [];
  return [];
};

export class ExponentialMovingAverage extends DflowNode {
  static kind = "EMA";
  static inputs = movingAverageInputs;
  static outputs = movingAverageOutputs;
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = ema(values, period);
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}

export const getMovingValues = (
  period: number,
  index: number,
  array: number[]
): number[] =>
  index >= 0 && index < array.length && index - period + 1 >= 0
    ? array.slice(index - period + 1, index + 1)
    : [];

export const sma: MovingAverage = (values, period) => {
  if (values.length < period) return [];
  return values.reduce<number[]>((result, _value, index, array) => {
    if (index < period - 1) return result;
    const movingValues = getMovingValues(period, index, array);
    const numDecimals = maxNumOfDecimals(movingValues);
    const sum = movingValues
      .map((value) => coerceToDecimal(value, numDecimals))
      .reduce<Decimal>((a, b) => add(a, b), "0");
    const average = div(sum, coerceToDecimal(period));
    return result.concat(decimalToNumber(average, numDecimals));
  }, []);
};

export class SimpleMovingAverage extends DflowNode {
  static kind = "MA";
  static inputs = movingAverageInputs;
  static outputs = movingAverageOutputs;
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = sma(values, period);
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}
