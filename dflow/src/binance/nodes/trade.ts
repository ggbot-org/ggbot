import { DflowNode } from "dflow";
import { BinanceDflowContext as Context } from "../context.js";

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
    const order = await binance.newOrder(symbol, "BUY", "MARKET", {});
    this.output(0).data = order;
  }
}

export class MarketSell extends DflowNode {
  static kind = "marketSell";
  static inputs = marketOrderInputs;
  static outputs = orderOutputs;
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data;
    const order = await binance.newOrder(symbol, "SELL", "MARKET", {});
    this.output(0).data = order;
  }
}
