import { DflowNode, DflowData } from "dflow";
import type { BinanceDflowContext as Context } from "../context.js";

const { input, output } = DflowNode;

export class TickerPrice extends DflowNode {
  static kind = "price";
  static isAsync = true;
  static inputs = [input("string", { name: "symbol" })];
  static outputs = [output("number", { name: "price" })];
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data as string;
    const data = await binance.tickerPrice(symbol);
    const price = parseFloat(data.price);
    if (DflowData.isNumber(price)) this.output(0).data = parseFloat(data.price);
    else this.clearOutputs();
  }
}
