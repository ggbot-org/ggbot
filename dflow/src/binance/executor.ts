import type { BinanceBalance } from "@ggbot2/binance";
import type { DflowNodesCatalog } from "dflow";
import {
  DflowCommonExecutorInput,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../common/executor.js";
import { ErrorMissingDflowExecutionReport } from "../errors.js";
import type { BinanceDflow, BinanceDflowContext } from "./context.js";
import { BinanceDflowHost } from "./host.js";

type BinanceDflowExecutorInput = DflowCommonExecutorInput;
type BinanceDflowExecutorOutput = DflowCommonExecutorOutput & {
  balances: BinanceBalance[];
};

export class BinanceDflowExecutor
  implements
    DflowExecutor<BinanceDflowExecutorInput, BinanceDflowExecutorOutput>
{
  constructor(
    readonly binance: BinanceDflow,
    readonly view: DflowExecutorView,
    readonly nodesCatalog: DflowNodesCatalog
  ) {}

  /**
   * Execute flow on given context.
   * @throws {ErrorMissingDflowExecutionReport}
   */
  async run(context: BinanceDflowExecutorInput) {
    const { binance, nodesCatalog, view } = this;
    const dflow = new BinanceDflowHost(
      { nodesCatalog },
      { binance, ...context }
    );
    dflow.load(view);
    await dflow.run();
    const execution = dflow.executionReport;
    if (!execution) throw new ErrorMissingDflowExecutionReport();
    const { memory, memoryChanged } = dflow.context as Pick<
      BinanceDflowContext,
      "memory" | "memoryChanged"
    >;
    return { balances: [], execution, memory, memoryChanged };
  }
}
