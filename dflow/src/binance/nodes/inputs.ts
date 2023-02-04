import { DflowNode } from "dflow";
import { BinanceDflowContext as Context } from "../context.js";
import { inputKey, inputInterval, inputSymbol, outputInterval, outputSymbol } from "./commonIO.js";

export class InputSymbol extends DflowNode {
  static kind = "inputSymbol";
  static inputs = [inputKey, inputSymbol];
  static outputs = [outputSymbol];
  async run() {
    const { binance } = this.host.context as Context;
    const key = this.input(0).data as string;
    const value = this.input(1).data as string;
    const isBinanceSymbol = await binance.isBinanceSymbol(value);
    if (!isBinanceSymbol) return this.clearOutputs();
    (this.host.context as Context).input[key] = value;
  }
}

export class InputInterval extends DflowNode {
  static kind = "inputInterval";
  static inputs = [inputKey, inputInterval];
  static outputs = [outputInterval];
  async run() {
    const { binance } = this.host.context as Context;
    const key = this.input(0).data as string;
    const value = this.input(1).data as string;
    const isBinanceSymbol = await binance.isBinanceSymbol(value);
    if (!isBinanceSymbol) return this.clearOutputs();
    (this.host.context as Context).input[key] = value;
  }
}
