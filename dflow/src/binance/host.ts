import { DflowHost, DflowHostConstructorArg } from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { DflowCommonContext } from "../common/context.js";
import { DflowLoader, load } from "../common/loader.js";
import { Binance } from "./executor.js";

/**
 * BinanceDflowHost extends DflowHost adding ggbot2 DflowCommonContext and
 * instances of BinanceClient and BinanceExchange.
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

  load(view: FlowViewSerializableGraph): void {
    load(view, this);
  }
}

export type BinanceDflowContext = DflowCommonContext & {
  binance: Binance;
};
