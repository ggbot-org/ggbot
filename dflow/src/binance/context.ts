import { DflowCommonContext } from "../common/context.js";
import { BinanceDflowClient } from "./client.js";

export type BinanceDflowContext = DflowCommonContext & {
  binance: BinanceDflowClient;
};
