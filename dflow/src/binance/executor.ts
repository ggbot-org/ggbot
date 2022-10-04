import type { BinanceBalance } from "@ggbot2/binance";
import type { DflowNodesCatalog } from "dflow";
import {
  DflowCommonExecutorInput,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../common/executor.js";
import { dflowValidate } from "../common/validate.js";
import { ErrorMissingDflowExecutionReport } from "../errors.js";
import type { BinanceDflow, BinanceDflowContext } from "./context.js";
import { BinanceDflowHost } from "./host.js";
import { getDflowBinanceNodesCatalog } from "./nodesCatalog.js";
import { binanceNodeTextToDflowKind } from "./nodeResolution.js";

type BinanceDflowExecutorInput = DflowCommonExecutorInput;
type BinanceDflowExecutorOutput = DflowCommonExecutorOutput & {
  balances: BinanceBalance[];
};

export class BinanceDflowExecutor
  implements
    DflowExecutor<BinanceDflowExecutorInput, BinanceDflowExecutorOutput>
{
  readonly binance: BinanceDflow;
  readonly view: DflowExecutorView;
  nodesCatalog: DflowNodesCatalog;

  constructor({
    binance,
    view,
  }: Pick<BinanceDflowExecutor, "binance" | "view">) {
    this.binance = binance;
    this.view = view;
    this.nodesCatalog = {};
  }

  /**
   * Populate nodesCatalog, validate view. Run it once, before `run()`.
   * @example
   * ```ts
   * await dflow.prepare();
   * await dflow.run({ memory: {} });
   * ```
   * @throws {ErrorUknownDflowNodes}
   */
  async prepare() {
    const { symbols } = await this.binance.exchangeInfo();
    const binanceNodesCatalog = getDflowBinanceNodesCatalog({ symbols });
    dflowValidate({
      nodesCatalog: binanceNodesCatalog,
      nodeTextToDflowKind: binanceNodeTextToDflowKind,
      view: this.view,
    });
    // If `dflowValidate` does not throw, update `nodesCatalog` with Binance nodes.
    this.nodesCatalog = binanceNodesCatalog;
  }

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
    const { memory, memoryChanged } = dflow.context as BinanceDflowContext;
    return { balances: [], execution, memory, memoryChanged };
  }
}
