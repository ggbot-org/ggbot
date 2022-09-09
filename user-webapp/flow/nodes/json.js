import { FlowViewNodeEditable } from "./editable.js";

export class FlowViewNodeJson extends FlowViewNodeEditable {
  static type = "json";
  init(arg) {
    super.init(arg);
    this.newOutput({});
  }
}
