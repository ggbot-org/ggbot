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
    { client, exchange, memory }: BinanceDflowHostConstructorArg
  ) {
    super(arg);

    this.context.client = client;
    this.context.exchange = exchange;

    this.context.memory = memory ?? {};
  }
}

export type BinanceDflowContext = DflowCommonContext & {
  client: BinanceClient;
  exchange: BinanceExchange;
};

type BinanceDflowHostConstructorArg = Pick<
  BinanceDflowContext,
  "client" | "exchange" | "memory"
>;
