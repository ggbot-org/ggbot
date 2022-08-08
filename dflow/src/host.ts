import { DflowHost, DflowHostConstructorArg } from "dflow";
import { Context } from "./context.js";

export class DflowCommonHost extends DflowHost {
  constructor(arg: DflowHostConstructorArg) {
    super(arg);

    const memory: Context["memory"] = {};
    this.context.memory = memory;
  }
}
