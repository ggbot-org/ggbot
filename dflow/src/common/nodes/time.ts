import { DflowNode } from "dflow";

const { output } = DflowNode;

export class Now extends DflowNode {
  static kind = "now";
  static outputs = [
    output("string", { name: "timestamp" }),
    output("number", { name: "milliseconds" }),
    output("string", { name: "yyyy-mm-dd" }),
  ];
  run() {
    const now = Date.now();
    const timestamp = new Date(now).toJSON();
    this.output(0).data = timestamp;
    this.output(1).data = now;
    this.output(2).data = timestamp.substring(0, 10);
  }
}
