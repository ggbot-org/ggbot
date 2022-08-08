import { DflowHostConstructorArg } from "dflow";
import { DflowCommonHost } from "@ggbot2/dflow";
import { Context } from "./context.js";

type BinanceDflowHostConstructorArg = Pick<Context, "client" | "exchange">;

export class BinanceDflowHost extends DflowCommonHost {
  constructor(
    arg: DflowHostConstructorArg,
    { client, exchange }: BinanceDflowHostConstructorArg
  ) {
    super(arg);

    this.context.client = client;
    this.context.exchange = exchange;
  }
}
