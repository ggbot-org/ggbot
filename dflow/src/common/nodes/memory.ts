import { DflowData, DflowNode } from "dflow";
import type { DflowCommonContext as Context } from "../context.js";

const { input, output } = DflowNode;

const inputKey = input("string", { name: "key" });

export class DeleteMemory extends DflowNode {
  static kind = "deleteMemory";
  static inputs = [inputKey];
  async run() {
    const key = this.input(0).data as string;
    const value = (this.host.context as Context).memory[key];
    if (value === undefined) return;
    delete (this.host.context as Context).memory[key];
    (this.host.context as Context).memoryChanged = true;
  }
}

export class GetMemory extends DflowNode {
  static kind = "getMemory";
  static inputs = [inputKey];
  static outputs = [output([], { name: "value" })];
  async run() {
    const key = this.input(0).data as string;
    this.output(0).data = (this.host.context as Context).memory[key];
  }
}

export class SetMemory extends DflowNode {
  static kind = "setMemory";
  static inputs = [inputKey, input([], { name: "value" })];
  async run() {
    const key = this.input(0).data as string;
    const value = this.input(1).data as DflowData;
    const previousValue = (this.host.context as Context).memory[key];
    if (Object.is(value, previousValue)) return;
    (this.host.context as Context).memoryChanged = true;
    (this.host.context as Context).memory[key] = value;
  }
}
