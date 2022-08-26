import { DflowNode } from "dflow";
import { BinanceDflowContext as Context } from "../host.js";

const { input, output } = DflowNode;

const marketOrderInputs = [
  input("string", { name: "symbol" }),
  input("number", { name: "quantity", optional: true }),
  input("number", { name: "quoteOrderQty", optional: true }),
];
const orderOutputs = [output("object", { name: "order" })];

export class MarketBuy extends DflowNode {
  static kind = "marketBuy";
  static inputs = marketOrderInputs;
  static outputs = orderOutputs;
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data;
    if (!binance.canTradeSymbol({ orderType: "MARKET", symbol })) return;
  }
}

export class MarketSell extends DflowNode {
  static kind = "marketSell";
  static inputs = marketOrderInputs;
  static outputs = orderOutputs;
  async run() {}
}
