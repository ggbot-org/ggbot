import type { Balance, Order } from "@ggbot2/models";
import type { DflowNodesCatalog } from "dflow";
import type {
  DflowCommonExecutorContext,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../common/executor.js";
import type { BinanceDflowClient } from "./client.js";
import type { BinanceDflowContext } from "./context.js";
import {
  getBalancesFromExecutionSteps,
  getOrdersFromExecutionSteps,
} from "./execution.js";
import { BinanceDflowHost } from "./host.js";
import type { DflowBinanceSymbolInfo } from "./symbols.js";

type BinanceDflowExecutorOutput = DflowCommonExecutorOutput & {
  balances: Balance[];
  orders: Pick<Order, "info">[];
};

export class BinanceDflowExecutor
  implements
    DflowExecutor<DflowCommonExecutorContext, BinanceDflowExecutorOutput>
{
  constructor(
    readonly binance: BinanceDflowClient,
    readonly binanceSymbols: DflowBinanceSymbolInfo[],
    readonly nodesCatalog: DflowNodesCatalog
  ) {}

  /** Execute flow on given context. */
  async run(context: DflowCommonExecutorContext, view: DflowExecutorView) {
    const { binance, binanceSymbols, nodesCatalog } = this;
    const dflow = new BinanceDflowHost(
      { nodesCatalog },
      { binance, ...context }
    );
    dflow.load(view);
    await dflow.run();
    const execution = dflow.executionReport;
    const { memory, memoryChanged } = dflow.context as Pick<
      BinanceDflowContext,
      "memory" | "memoryChanged"
    >;
    const balances = execution
      ? getBalancesFromExecutionSteps(binanceSymbols, execution.steps)
      : [];
    const orders = execution
      ? getOrdersFromExecutionSteps(execution.steps).map((info) => ({ info }))
      : [];
    return { balances, execution, memory, memoryChanged, orders };
  }
}
