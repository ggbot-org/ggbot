import {
  BinanceAccountInformation,
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import { DflowNodesCatalog } from "dflow";
import {
  DflowCommonExecutorInput,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../common/executor.js";
import { dflowValidate } from "../common/validate.js";
import { ErrorMissingDflowExecutionReport } from "../errors.js";
import { BinanceDflowContext, BinanceDflowHost } from "./host.js";
import { getDflowBinanceNodesCatalog } from "./nodesCatalog.js";

export interface Binance {
  // Public API
  // //////////////////////////////////////////////////////////////////

  avgPrice(symbol: unknown): Promise<BinanceAvgPrice>;

  exchangeInfo(): Promise<BinanceExchangeInfo>;

  // Private API
  // //////////////////////////////////////////////////////////////////

  account(): Promise<BinanceAccountInformation>;

  newOrder(
    symbol: unknown,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL>;
}

type BinanceDflowExecutorRunInput = DflowCommonExecutorInput;
type BinanceDflowExecutorRunOutput = DflowCommonExecutorOutput & {
  balances: Binance[];
};

export class BinanceDflowExecutor
  implements
    DflowExecutor<BinanceDflowExecutorRunInput, BinanceDflowExecutorRunOutput>
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
    const { binance, view } = this;
    const nodesCatalog = await getDflowBinanceNodesCatalog({
      binance: this.binance,
    });
    // Use a temporary Dflow host for validation.
    const dflow = new BinanceDflowHost(
      { nodesCatalog },
      { binance, memory: {} }
    );
    // Use dflow.nodesCatalog as dflowValidate() parameter, cause dflow adds few builtin nodes.
    dflowValidate(dflow.nodesCatalog, view);
    // If dflowValidate does not throw, update `nodesCatalog` with Binance nodes.
    this.nodesCatalog = nodesCatalog;
  }

  /**
   * Execute flow on given context.
   * @throws {ErrorMissingDflowExecutionReport}
   */
  async run(context: BinanceDflowExecutorRunInput) {
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
