import type { BinanceBalance } from "@ggbot2/binance";
import type { DflowNodesCatalog } from "dflow";
import {
  DflowCommonExecutorContext,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../common/executor.js";
import type { BinanceDflow, BinanceDflowContext } from "./context.js";
import { BinanceDflowHost } from "./host.js";

type BinanceDflowExecutorOutput = DflowCommonExecutorOutput & {
  balances: BinanceBalance[];
};

export class BinanceDflowExecutor
  implements
    DflowExecutor<DflowCommonExecutorContext, BinanceDflowExecutorOutput>
{
  constructor(
    readonly binance: BinanceDflow,
    readonly nodesCatalog: DflowNodesCatalog
  ) {}

  /** Execute flow on given context. */
  async run(context: DflowCommonExecutorContext, view: DflowExecutorView) {
    const { binance, nodesCatalog } = this;
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
    return { balances: [], execution, memory, memoryChanged };
  }
}
