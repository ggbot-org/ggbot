import { DflowNode, DflowData } from "dflow";
import type { BinanceDflowContext as Context } from "../context.js";
import {
  inputInterval,
  inputSymbol,
  outputLow,
  outputHigh,
  outputClose,
  outputOpen,
  outputVolume,
} from "./commonIO.js";

const { output } = DflowNode;

export class Candles extends DflowNode {
  static kind = "candles";
  static inputs = [inputSymbol, inputInterval];
  static outputs = [
    outputOpen,
    outputHigh,
    outputLow,
    outputClose,
    outputVolume,
  ];
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data as string;
    const isBinanceSymbol = await binance.isBinanceSymbol(symbol);
    if (isBinanceSymbol) {
      // TODO get candles
    } else this.clearOutputs();
  }
}

export class TickerPrice extends DflowNode {
  static kind = "price";
  static inputs = [inputSymbol];
  static outputs = [output("number", { name: "price" })];
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data as string;
    const isBinanceSymbol = await binance.isBinanceSymbol(symbol);
    if (isBinanceSymbol) {
      const data = await binance.tickerPrice(symbol);
      const price = parseFloat(data.price);
      if (DflowData.isNumber(price)) this.output(0).data = price;
    } else this.clearOutputs();
  }
}
