import { isBinanceKlineInterval } from "@ggbot2/binance";
import { DflowNode, DflowData } from "dflow";
import type { BinanceDflowContext as Context } from "../context.js";
import {
  inputInterval,
  inputSymbol,
  outputClose,
  outputHigh,
  outputLow,
  outputOpen,
  outputTime,
  outputVolume,
} from "./commonIO.js";

const { input, output } = DflowNode;

type CandlesOutputs = {
  time: number[];
  open: string[];
  high: string[];
  low: string[];
  close: string[];
  volume: string[];
};

export class Candles extends DflowNode {
  static kind = "candles";
  static inputs = [
    inputSymbol,
    inputInterval,
    input("number", { name: "limit" }),
  ];
  static outputs = [
    outputTime,
    outputOpen,
    outputHigh,
    outputLow,
    outputClose,
    outputVolume,
  ];
  async run() {
    const { binance } = this.host.context as Context;
    const symbol = this.input(0).data as string;
    const interval = this.input(1).data as string;
    const limit = this.input(2).data as number;
    const isBinanceSymbol = await binance.isBinanceSymbol(symbol);
    if (!isBinanceSymbol || !isBinanceKlineInterval(interval))
      return this.clearOutputs();
    const data = await binance.candles(symbol, interval, limit);
    const { time, open, high, low, close, volume } =
      data.reduce<CandlesOutputs>(
        ({ time, open, high, low, close, volume }, kline) => ({
          time: [...time, kline[0]],
          open: [...open, kline[1]],
          high: [...high, kline[2]],
          low: [...low, kline[3]],
          close: [...close, kline[4]],
          volume: [...volume, kline[5]],
        }),
        {
          time: [],
          open: [],
          high: [],
          low: [],
          close: [],
          volume: [],
        }
      );
    this.output(0).data = time;
    this.output(1).data = open;
    this.output(2).data = high;
    this.output(3).data = low;
    this.output(4).data = close;
    this.output(5).data = volume;
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
    if (!isBinanceSymbol) return this.clearOutputs();
    const data = await binance.tickerPrice(symbol);
    const price = parseFloat(data.price);
    if (DflowData.isNumber(price)) this.output(0).data = price;
  }
}
