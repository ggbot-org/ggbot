import { DflowHost, DflowHostConstructorArg } from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { BinanceClient, BinanceExchange } from "@ggbot2/binance";
import { ErrorUknownDflowNodes } from "../errors.js";
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
      dryRun,
      memory,
      timestamp,
      // BinanceDflowContext
      client,
      exchange,
    }: BinanceDflowContext
  ) {
    super(arg);

    // DflowCommonContext
    this.context.dryRun = dryRun;
    this.context.memory = memory ?? {};
    this.context.timestamp = timestamp;

    // BinanceDflowContext
    this.context.client = client;
    this.context.exchange = exchange;
  }

  /**
   * Check if provided view is well defined, is compatible with nodesCatalog.
   *
   * @throws ErrorUknownDflowNodes
   */
  loadView(_view: FlowViewSerializableGraph): void {
    throw new ErrorUknownDflowNodes([]);
  }
}

export type BinanceDflowContext = Omit<DflowCommonContext, "memoryChanged"> & {
  client: BinanceClient;
  exchange: BinanceExchange;
};
