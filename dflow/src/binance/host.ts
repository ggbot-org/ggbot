import {now, truncateTimestamp} from "@ggbot2/time";
import {DflowHost, DflowHostConstructorArg} from "dflow";
import {DflowExecutorView} from "../common/executor.js";
import {DflowLoader, load} from "../common/loader.js";
import type {BinanceDflowContext} from "./context.js";
import {binanceNodeTextToDflowKind} from "./nodeResolution.js";

/**
 * BinanceDflowHost extends DflowHost adding ggbot2 DflowCommonContext
 * and an instance of Binance client.
 */
export class BinanceDflowHost extends DflowHost implements DflowLoader {
  constructor(
    arg: DflowHostConstructorArg,
    context: BinanceDflowHostContextArg
  ) {
    super(arg);
    this.context.binance = context.binance;
    this.context.memory = context.memory ?? {};
    this.context.memoryChanged = false;
    this.context.timestamp =
      context.timestamp ?? truncateTimestamp({value: now(), to: "second"});
  }

  load(view: DflowExecutorView): void {
    load({dflow: this, nodeTextToDflowKind: binanceNodeTextToDflowKind, view});
  }
}

export type BinanceDflowHostContextArg = Partial<
  Omit<BinanceDflowContext, "memoryChanged">
>;
