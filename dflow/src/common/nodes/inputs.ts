import { DflowNode } from "dflow";
import { DflowCommonContext as Context } from "../context.js";
import { inputKey } from "./commonIO.js";

const { input, output } = DflowNode;

export class InputNumber extends DflowNode {
  static kind = "inputNumber";
  static inputs = [inputKey, input("number")];
  static outputs = [output("number")];
  run() {
    const key = this.input(0).data as string;
    const value = this.input(1).data as number;
    (this.host.context as Context).input[key] = value;
  }
}
