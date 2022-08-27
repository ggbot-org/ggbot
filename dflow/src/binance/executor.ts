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

export class BinanceDflowExecutor implements DflowExecutor {
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
   * @throws ErrorUknownDflowNodes
   */
  async prepare() {
    const nodesCatalog = await getDflowBinanceNodesCatalog({
      binance: this.binance,
    });
    dflowValidate(nodesCatalog, this.view);
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
    return { balances: [], memory: {}, memoryChanged: false };
  }
}
