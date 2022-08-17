import { StrategyMemory } from "@ggbot2/models";

/**
 * DflowCommonContext to be shared among all dflow host implementations.
 *
 * @example
 * ```typescript
 * import { DflowHost, DflowHostConstructorArg } from "dflow";
 * import { DflowCommonContext } from "@ggbot2/dflow";
 *
 * export class MyDflowHost extends DflowHost {
 *   constructor(arg: DflowHostConstructorArg) {
 *     super(arg);
 *
 *     const memory: DflowCommonContext["memory"] = {};
 *     this.context.memory = memory;
 *   }
 * }
 * ```
 */
export type DflowCommonContext = {
  memory: StrategyMemory;
};
