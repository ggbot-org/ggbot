import {
  BinanceAccountInformation,
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import { StrategyFlow } from "@ggbot2/models";
import { DflowNodesCatalog } from "dflow";
import {
  DflowCommonContext,
  DflowExecutor,
  dflowValidate,
} from "../common/index.js";
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

type BinanceDflowExecutorRunInput = Pick<DflowCommonContext, "memory">;
type BinanceDflowExecutorRunOutput = Pick<
  DflowCommonContext,
  "memory" | "memoryChanged"
> & { balances: Binance[] };

export class BinanceDflowExecutor
  implements
    DflowExecutor<BinanceDflowExecutorRunInput, BinanceDflowExecutorRunOutput>
{
  readonly binance: Binance;
  readonly view: StrategyFlow["view"];
  nodesCatalog: DflowNodesCatalog;

  constructor({
    binance,
    view,
  }: Pick<BinanceDflowContext, "binance"> & Pick<StrategyFlow, "view">) {
    this.binance = binance;
    this.view = view;
    this.nodesCatalog = {};
  }

  /**
   * Populate nodesCatalog, validate view. Run it once, before `run()`
   *
   * @throws ErrorUknownDflowNodes
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
   */
  async run(context: Pick<DflowCommonContext, "memory">) {
    const { binance, nodesCatalog, view } = this;
    const dflow = new BinanceDflowHost(
      { nodesCatalog },
      { binance, ...context }
    );
    dflow.load(view);
    await dflow.run();
    const { memory, memoryChanged } = dflow.context as BinanceDflowContext;
    return { balances: [], memory, memoryChanged };
  }
}
