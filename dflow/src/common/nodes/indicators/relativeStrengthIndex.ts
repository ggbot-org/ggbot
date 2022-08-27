import { DflowNode } from "dflow";
import {
  inputPeriod,
  inputValues,
  outputLastValue,
  outputValues,
} from "./commonIO.js";

export const rsi = (values: number[], period: number): number[] => {
  if (values.length < period) return [];
  return [];
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
