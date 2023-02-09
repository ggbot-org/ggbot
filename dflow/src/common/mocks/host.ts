import { DflowHost, DflowHostConstructorArg } from "dflow";
import { DflowExecutorView, DflowCommonExecutorContext } from "../executor.js";
import { DflowLoader, load } from "../loader.js";
import { commonNodeTextToDflowKind } from "../nodeResolution.js";

export class DflowCommonHostMock extends DflowHost implements DflowLoader {
  constructor(arg: DflowHostConstructorArg, context: DflowCommonExecutorContext) {
    super(arg);
    this.context.input = context.input;
    this.context.memory = context.memory;
    this.context.memoryChanged = false;
    this.context.time = context.time;
  }
  load(view: DflowExecutorView): void {
    load({ dflow: this, nodeTextToDflowKind: commonNodeTextToDflowKind, view });
  }
}
