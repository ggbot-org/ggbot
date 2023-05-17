import {
  add,
  decimalToNumber,
  div,
  maxNumOfDecimals,
} from "@ggbot2/arithmetic";
import { DflowNode } from "dflow";

import {
  inputClose,
  inputHigh,
  inputLow,
  outputLastValue,
  outputValues,
} from "../commonIO.js";

export const typicalPrice = (
  high: number,
  low: number,
  close: number
): number => {
  const numDecimals = maxNumOfDecimals([high, low, close]);
  const sum = add(add(high, low, numDecimals), close, numDecimals);
  return decimalToNumber(div(sum, 3), numDecimals);
};

export class TypicalPrice extends DflowNode {
  static kind = "typicalPrice";
  static inputs = [inputHigh, inputLow, inputClose];
  static outputs = [outputValues, outputLastValue];
  async run() {
    const high = this.input(0).data as number[];
    const low = this.input(1).data as number[];
    const close = this.input(2).data as number[];
    const size = high.length;
    if (close.length !== size || low.length !== size) {
      this.clearOutputs();
      return;
    }
    const result: number[] = [];
    for (let i = 0; i < size; i++) {
      result.push(typicalPrice(high[i], low[i], close[i]));
    }
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}
