import { DflowNode } from "dflow";
import { add, coerceToDecimal } from "../arithmetic.js";

const { input, output } = DflowNode;

const binaryOperatorInputs = [input("number"), input("number")];

const binaryOperatorOutputs = [output("number")];

export class Addition extends DflowNode {
  static kind = "addition";
  static inputs = binaryOperatorInputs;
  static outputs = binaryOperatorOutputs;
  run() {
    const a = this.input(0).data as number;
    const b = this.input(1).data as number;
    this.output(0).data = add(coerceToDecimal(a), coerceToDecimal(b));
  }
}
