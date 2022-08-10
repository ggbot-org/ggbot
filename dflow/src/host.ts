import { StrategyMemory } from "@ggbot2/models";
import { DflowHost, DflowHostConstructorArg } from "dflow";

export type DflowCommonHostContext = {
  memory: StrategyMemory;
};

export class DflowCommonHost extends DflowHost {
  constructor(arg: DflowHostConstructorArg) {
    super(arg);

    const memory: DflowCommonHostContext["memory"] = {};
    this.context.memory = memory;
  }
}
