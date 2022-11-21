import type { DflowGraphExecutionReport } from "dflow";
import { orderBuyBTCBUSD } from "./order.js";

export const executionStepsBuyBTCUSD: DflowGraphExecutionReport["steps"] = [
  {
    id: "jxhrh",
    k: "data",
    o: [
      {
        id: "o",
        d: 20,
      },
    ],
  },
  {
    id: "qqpmg",
    k: "BTC/BUSD",
    o: [
      {
        id: "o0",
        d: "BTCBUSD",
      },
    ],
  },
  {
    id: "pgzne",
    k: "buyMarket",
    o: [
      {
        id: "o0",
        d: orderBuyBTCBUSD,
      },
    ],
  },
];
