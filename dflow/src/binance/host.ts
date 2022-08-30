import { DflowHost, DflowHostConstructorArg } from "dflow";
import { DflowCommonContext } from "../common/context.js";
import { DflowExecutorView } from "../common/executor.js";
import { DflowLoader, load } from "../common/loader.js";
import { Binance } from "./executor.js";

/**
 * BinanceDflowHost extends DflowHost adding ggbot2 DflowCommonContext
 * and an instance of Binance client.
 */
export class BinanceDflowHost extends DflowHost implements DflowLoader {
  constructor(
    arg: DflowHostConstructorArg,
    {
      // DflowCommonContext
      memory,
      // BinanceDflowContext
      binance,
    }: BinanceDflowContext
  ) {
    super(arg);
    this.context.binance = binance;
    this.context.memory = memory;
    this.context.memoryChanged = false;
  }

  load(view: DflowExecutorView): void {
    load(view, this);
  }
}

export type BinanceDflowContext = DflowCommonContext & {
  binance: Binance;
};
