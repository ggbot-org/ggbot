import { DflowNode } from "dflow";

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
  async run() {}
}

export class MarketSell extends DflowNode {
  static kind = "marketSell";
  static inputs = marketOrderInputs;
  static outputs = orderOutputs;
  async run() {}
}
