import { FlowViewNodeEditable } from "./editable";

export class FlowViewNodePercentage extends FlowViewNodeEditable {
  static type = "perc";
  init(arg) {
    super.init(arg);
    if (this.outputs.length === 0) this.newOutput({ id: "o" });
  }
}
