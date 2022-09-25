import {
  Decimal,
  coerceToDecimal,
  decimalToNumber,
  numOfDecimals,
  add,
  mul,
  div,
  sub,
} from "@ggbot2/arithmetic";
import { DflowNode } from "dflow";
import {
  inputPeriod,
  inputValues,
  outputLastValue,
  outputValues,
} from "./commonIO.js";

export const rsi = (values: number[], period: number): number[] => {
  const size = values.length;
  const outputs: number[] = [];
  if (size < period) return outputs;

  const periodDecimal = coerceToDecimal(period);
  const decimalValues: Decimal[] = values.map((num) => coerceToDecimal(num));
  const maxNumDecimals = decimalValues.reduce<number>(
    (max, num) => Math.max(max, numOfDecimals(num)),
    0
  );
  const zero = coerceToDecimal(0, maxNumDecimals);
  const oneHundred = coerceToDecimal(100, maxNumDecimals);
  const oneOverPeriod = coerceToDecimal(1 / period, maxNumDecimals);

  const getUpward = (current: Decimal, previous: Decimal): Decimal =>
    current > previous ? sub(current, previous) : zero;
  const getDownard = (current: Decimal, previous: Decimal): Decimal =>
    current < previous ? sub(previous, current) : zero;
  const getOutput = (smoothUp: Decimal, smoothDown: Decimal): number =>
    decimalToNumber(
      mul(oneHundred, div(smoothUp, add(smoothUp, smoothDown))),
      maxNumDecimals
    );

  let smoothUp = zero;
  let smoothDown = zero;
  for (let i = 1; i <= period; i++) {
    const current = decimalValues[i];
    const previous = decimalValues[i - 1];
    const upward = getUpward(current, previous);
    const downward = getDownard(current, previous);
    smoothUp = add(smoothUp, upward);
    smoothDown = add(smoothDown, downward);
  }

  smoothUp = div(smoothUp, periodDecimal);
  smoothDown = div(smoothDown, periodDecimal);
  outputs.push(getOutput(smoothUp, smoothDown));

  for (let i = period + 1; i < size; i++) {
    const current = decimalValues[i];
    const previous = decimalValues[i - 1];
    const upward = getUpward(current, previous);
    const downward = getDownard(current, previous);
    smoothUp = add(mul(sub(upward, smoothUp), oneOverPeriod), smoothUp);
    smoothDown = add(mul(sub(downward, smoothDown), oneOverPeriod), smoothDown);
    outputs.push(getOutput(smoothUp, smoothDown));
  }

  return outputs;
};

export class RelativeStrengthIndex extends DflowNode {
  static kind: "RSI";
  static inputs = [inputValues, inputPeriod];
  static outputs = [outputValues, outputLastValue];
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = rsi(values, period);
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}
