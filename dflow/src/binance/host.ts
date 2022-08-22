import { DflowHost, DflowHostConstructorArg } from "dflow";
import { BinanceClient, BinanceExchange } from "@ggbot2/binance";
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
}

export type BinanceDflowContext = Partial<
  Omit<DflowCommonContext, "memoryChanged">
> & {
  client: BinanceClient;
  exchange: BinanceExchange;
};
