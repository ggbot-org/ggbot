import { DflowNode, DflowData } from "dflow";
import type { BinanceDflowContext as Context } from "../host.js";

const { input, output } = DflowNode;

export class AvgPrice extends DflowNode {
  static kind = "avgPrice";
  static isAsync = true;
  static inputs = [input("string", { name: "symbol" })];
  static outputs = [output("number", { name: "price" })];
  async run() {
    const exchange = this.host.context.exchange as Context["exchange"];
    const symbol = this.input(0).data as string;
    const data = await exchange.avgPrice(symbol);
    const price = parseFloat(data.price);
    if (DflowData.isNumber(price)) this.output(0).data = parseFloat(data.price);
    else this.clearOutputs();
  }
}
