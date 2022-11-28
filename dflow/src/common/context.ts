import type { Time } from "@ggbot2/time";
import type { DflowObject } from "dflow";

/** DflowCommonContext to be shared among all dflow host implementations.
@example
```ts
import { DflowHost, DflowHostConstructorArg } from "dflow";
import { DflowCommonContext } from "@ggbot2/dflow";

export class MyDflowHost extends DflowHost {
  constructor(arg: DflowHostConstructorArg) {
    super(arg);

    const memory: DflowCommonContext["memory"] = {};
    this.context.memory = memory;
  }
}
``` */
export type DflowCommonContext = {
  /** Used by memory nodes: GetMemory, SetMemory, DeleteMemory. */
  memory: DflowObject;
  /** The `memoryChanged` attribute is set to true by memory nodes every time there is a change (e.g. update or delete) in memory. */
  memoryChanged?: undefined | boolean;
  /** Time related nodes read the `time` value. */
  time: Time;
};
