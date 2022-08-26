import { DflowHost, DflowHostConstructorArg } from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { BinanceClient } from "@ggbot2/binance";
import { DflowCommonContext } from "../common/context.js";

/**
 * BinanceDflowHost extends DflowHost adding ggbot2 DflowCommonContext and
 * instances of BinanceClient and BinanceExchange.
 */
export class BinanceDflowHost extends DflowHost {
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

    // DflowCommonContext
    this.context.memory = memory;

    // BinanceDflowContext
    this.context.binance = binance;
  }

  load(_view: FlowViewSerializableGraph): void {}
}

export type BinanceDflowContext = DflowCommonContext & {
  binance: BinanceClient;
};
