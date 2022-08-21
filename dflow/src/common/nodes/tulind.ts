import { DflowNode } from "dflow";
import { indicators } from "tulind";
import { promisify } from "node:util";

const { input, output } = DflowNode;

const movingAverageInputs = [
  input("array", { name: "values" }),
  input("number", { name: "period" }),
];

const movingAverageOutputs = [
  output("array", { name: "values" }),
  output("number", { name: "last" }),
];

export class Sma extends DflowNode {
  static kind = "sma";
  static inputs = movingAverageInputs;
  static outputs = movingAverageOutputs;
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = await promisify(indicators.sma.indicator)(
      [values],
      [period]
    );
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}

export class Ema extends DflowNode {
  static kind = "ema";
  static inputs = movingAverageInputs;
  static outputs = movingAverageOutputs;
  async run() {
    const values = this.input(0).data as number[];
    const period = this.input(1).data as number;
    const result = await promisify(indicators.ema.indicator)(
      [values],
      [period]
    );
    this.output(0).data = result;
    this.output(1).data = result.slice(-1).pop();
  }
}
