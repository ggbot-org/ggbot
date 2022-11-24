import { coerceToDecimal } from "@ggbot2/arithmetic";
import { DflowNode } from "dflow";
import type { BinanceDflowContext as Context } from "../context.js";

const { input, output } = DflowNode;

const marketOrderInputs = [
  input("string", { name: "symbol" }),
  input("number", { name: "quantity", optional: true }),
  input("number", { name: "quoteOrderQty", optional: true }),
];
export const orderOutput = output("object", { name: "order" });
const orderOutputs = [orderOutput];

export class BuyMarket extends DflowNode {
  static kind = "buyMarket";
  static inputs = marketOrderInputs;
  static outputs = orderOutputs;
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data as string;
    const quantity = this.input(1).data as number | undefined;
    const quoteOrderQty = this.input(2).data as number | undefined;
    const isBinanceSymbol = await binance.isBinanceSymbol(symbol);
    if (!isBinanceSymbol) return this.clearOutputs();
    const order = await binance.newOrder(symbol, "BUY", "MARKET", {
      quantity: quantity === undefined ? undefined : coerceToDecimal(quantity),
      quoteOrderQty:
        quoteOrderQty === undefined
          ? undefined
          : coerceToDecimal(quoteOrderQty),
    });
    this.output(0).data = order;
  }
}

export class SellMarket extends DflowNode {
  static kind = "sellMarket";
  static inputs = marketOrderInputs;
  static outputs = orderOutputs;
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data as string;
    const quantity = this.input(1).data as number | undefined;
    const quoteOrderQty = this.input(2).data as number | undefined;
    const isBinanceSymbol = await binance.isBinanceSymbol(symbol);
    if (!isBinanceSymbol) return this.clearOutputs();
    const order = await binance.newOrder(symbol, "SELL", "MARKET", {
      quantity: quantity === undefined ? undefined : coerceToDecimal(quantity),
      quoteOrderQty:
        quoteOrderQty === undefined
          ? undefined
          : coerceToDecimal(quoteOrderQty),
    });
    this.output(0).data = order;
  }
}
