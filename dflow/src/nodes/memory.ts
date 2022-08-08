import { DflowNode } from "dflow";
import { DflowCommonHostContext as Context } from "../host.js";

const { input, output } = DflowNode;

class GetMemory extends DflowNode {
  static kind = "getMemory";
  static inputs = [input("string", { name: "key" })];
  static outputs = [output([], { name: "value" })];
  async run() {
    const key = this.input(0).data as string;
    this.output(0).data = (this.host.context as Context).memory[key];
  }
}

export const catalog = {
  [GetMemory.kind]: GetMemory,
};
