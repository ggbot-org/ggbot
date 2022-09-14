import { now, truncateTimestamp } from "@ggbot2/time";
import { DflowHost, DflowHostConstructorArg } from "dflow";
import { DflowExecutorView, DflowCommonExecutorInput } from "../executor.js";
import { DflowLoader, load } from "../loader.js";
import { commonNodeTextToDflowKind } from "../nodeResolution.js";

export class DflowCommonHostMock extends DflowHost implements DflowLoader {
  constructor(arg: DflowHostConstructorArg, context: DflowCommonExecutorInput) {
    super(arg);
    this.context.memory = context.memory ?? {};
    this.context.memoryChanged = false;
    this.context.timestamp =
      context.timestamp ?? truncateTimestamp({ value: now(), to: "second" });
  }
  load(view: DflowExecutorView): void {
    load({ dflow: this, nodeTextToDflowKind: commonNodeTextToDflowKind, view });
  }
}
