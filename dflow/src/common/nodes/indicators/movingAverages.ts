import { DflowNode } from "dflow";
import {
  Decimal,
  add,
  coerceToDecimal,
  decimalToNumber,
  div,
  numOfDecimals,
} from "../../arithmetic.js";

type MovingAverage = (values: number[], period: number) => number[];

const { input, output } = DflowNode;

const movingAverageInputs = [
  input("array", { name: "values" }),
  input("number", { name: "period" }),
];

const movingAverageOutputs = [
  output("array", { name: "values" }),
  output("number", { name: "last" }),
];

export const ema: MovingAverage = (values, period) => {
  if (values.length < period) return [];
  return [];
};

export class Ema extends DflowNode {
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

export const sma: MovingAverage = (values, period) => {
  if (values.length < period) return [];
  return values.reduce<number[]>((result, _value, index, array) => {
    if (index < period - 1) return result;
    const movingValues: Decimal[] = array
      .slice(index - period + 1, index + 1)
      .map((num) => coerceToDecimal(num));
    const maxNumDecimals = movingValues.reduce<number>(
      (max, num) => Math.max(max, numOfDecimals(num)),
      0
    );
    const sum = movingValues.reduce<Decimal>((a, b) => add(a, b), "0");
    const average = div(sum, coerceToDecimal(period));
    return result.concat(decimalToNumber(average, maxNumDecimals));
  }, []);
};

export class Sma extends DflowNode {
  static kind = "SMA";
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
