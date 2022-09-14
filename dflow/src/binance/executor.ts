import type { DflowNodesCatalog } from "dflow";
import {
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../common/executor.js";
import { dflowValidate } from "../common/validate.js";
import { ErrorMissingDflowExecutionReport } from "../errors.js";
import type { Binance, BinanceDflowContext } from "./context.js";
import { BinanceDflowHost, BinanceDflowHostContextArg } from "./host.js";
import { getDflowBinanceNodesCatalog } from "./nodesCatalog.js";
import { nodeTextToDflowKind } from "./nodeResolution.js";

type BinanceDflowExecutorInput = Omit<BinanceDflowHostContextArg, "binance">;
type BinanceDflowExecutorOutput = DflowCommonExecutorOutput & {
  balances: Binance[];
};

export class BinanceDflowExecutor
  implements
    DflowExecutor<BinanceDflowExecutorInput, BinanceDflowExecutorOutput>
{
  readonly binance: Binance;
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
    const binanceNodesCatalog = await getDflowBinanceNodesCatalog({
      binance: this.binance,
    });
    dflowValidate({
      nodesCatalog: binanceNodesCatalog,
      nodeTextToDflowKind,
      view: this.view,
    });
    // If dflowValidate does not throw, update `nodesCatalog` with Binance nodes.
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
