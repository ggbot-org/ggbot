import { getDayFromDate } from "@ggbot2/time";
import { DflowNode } from "dflow";
import { DflowCommonContext as Context } from "../context.js";

const { output } = DflowNode;

export class Today extends DflowNode {
  static kind = "today";
  static outputs = [output("string", { name: "yyyy-mm-dd" })];
  run() {
    const timestamp = (this.host.context as Context).timestamp;
    const day = getDayFromDate(new Date(timestamp));
    this.output(0).data = day;
  }
}
