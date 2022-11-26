import { DflowNode } from "dflow";

const { input, output } = DflowNode;

export class NullishCoaleshing extends DflowNode {
  static kind = "??";
  static inputs = [input(), input()];
  static outputs = [output()];
  run() {
    this.output(0).data = this.input(0).data ?? this.input(1).data;
  }
}
