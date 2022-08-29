import { DflowHost, DflowHostConstructorArg } from "dflow";
import { DflowCommonContext } from "../context.js";
import { DflowExecutorView } from "../executor.js";
import { DflowLoader, load } from "../loader.js";

export class DflowCommonHostMock extends DflowHost implements DflowLoader {
  constructor(arg: DflowHostConstructorArg, { memory }: DflowCommonContext) {
    super(arg);
    this.context.memory = memory;
    this.context.memoryChanged = false;
  }
  load(view: DflowExecutorView): void {
    load(view, this);
  }
}
