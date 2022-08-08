import { BinanceClient } from "../client.js";
import { BinanceExchange } from "../exchange.js";

/** @private */
export type Context = {
  client: BinanceClient;
  exchange: BinanceExchange;
};
