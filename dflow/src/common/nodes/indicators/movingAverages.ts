import { DflowNode } from "dflow";

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
  static kind = "ema";
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
  return [];
};

export class Sma extends DflowNode {
  static kind = "sma";
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
