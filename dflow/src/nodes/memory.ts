import { DflowNode } from "dflow";
import { DflowCommonContext as Context } from "../context.js";

const { input, output } = DflowNode;

export class GetMemory extends DflowNode {
  static kind = "getMemory";
  static inputs = [input("string", { name: "key" })];
  static outputs = [output([], { name: "value" })];
  async run() {
    const key = this.input(0).data as string;
    this.output(0).data = (this.host.context as Context).memory[key];
  }
}
