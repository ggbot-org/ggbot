import type { Timestamp } from "@ggbot2/time";
import type { JsonObject } from "type-fest";

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
  /**
   * Used by memory nodes: GetMemory, SetMemory, DeleteMemory.
   */
  memory: JsonObject;
  /**
   * The `memoryChanged` attribute is set to true by memory nodes
   * every time there is a change (e.g. update or delete) in memory.
   */
  memoryChanged?: undefined | boolean;
  /**
   * Time related nodes use the `timestamp` value.
   */
  timestamp: Timestamp;
};
