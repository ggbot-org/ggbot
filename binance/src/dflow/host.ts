import { DflowHost, DflowHostConstructorArg } from "dflow";
import { DflowCommonContext } from "@ggbot2/dflow";
import { BinanceClient } from "../client.js";
import { BinanceExchange } from "../exchange.js";

/**
 * BinanceDflowHost extends DflowHost adding ggbot2 DflowCommonContext and
 * instances of BinanceClient and BinanceExchange.
 */
export class BinanceDflowHost extends DflowHost {
  constructor(
    arg: DflowHostConstructorArg,
    { client, exchange }: BinanceDflowHostConstructorArg
  ) {
    super(arg);

    this.context.client = client;
    this.context.exchange = exchange;

    const memory: DflowCommonContext["memory"] = {};
    this.context.memory = memory;
  }
}

export type BinanceDflowContext = DflowCommonContext & {
  client: BinanceClient;
  exchange: BinanceExchange;
};

type BinanceDflowHostConstructorArg = Pick<
  BinanceDflowContext,
  "client" | "exchange"
>;
