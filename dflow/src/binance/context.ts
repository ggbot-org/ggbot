import type { DflowCommonContext } from "../common/context.js";
import type { BinanceDflowClient } from "./client.js";

export type BinanceDflowContext = DflowCommonContext & {
  binance: BinanceDflowClient;
};
