import {
  Decimal,
  coerceToDecimal,
  decimalToNumber,
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
import { MovingAverage } from "./movingAverages.js";

export const rsi: MovingAverage = (values, period) => {
  const oneOverPeriod = 1 / period;
  const periodMinusOneOverPeriod = (period - 1) / period;
  const outputs: number[] = [];
  const upwardAverages: Decimal[] = [];
  const downwardAverages: Decimal[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      upwardAverages.push("0");
      downwardAverages.push("0");
      continue;
    }
    const previous = coerceToDecimal(values[i - 1]);
    const current = coerceToDecimal(values[i]);
    const upward: Decimal = current > previous ? sub(current, previous) : "0";
    const downward: Decimal = current < previous ? sub(previous, current) : "0";
    const upwardAverage = add(
      mul(oneOverPeriod, upward),
      mul(periodMinusOneOverPeriod, upwardAverages[i - 1])
    );
    upwardAverages.push(upwardAverage);
    const downwardAverage = add(
      mul(oneOverPeriod, downward),
      mul(periodMinusOneOverPeriod, downwardAverages[i - 1])
    );
    downwardAverages.push(downwardAverage);
    if (i > period + 1) {
      outputs.push(
        decimalToNumber(
          div(mul(100, upwardAverage), add(upwardAverage, downwardAverage))
        )
      );
    }
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
