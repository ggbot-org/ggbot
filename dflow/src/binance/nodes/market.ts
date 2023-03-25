import { decimalToNumber } from "@ggbot2/arithmetic";
import { BinanceKline, isBinanceKlineInterval } from "@ggbot2/binance";
import { Dflow, DflowNode } from "dflow";
import { isDflowBinanceKlineInterval } from "../klineIntervals.js";
import { BinanceDflowContext as Context } from "../context.js";
import {
  inputInterval,
  inputSymbol,
  outputClose,
  outputHigh,
  outputLow,
  outputOpen,
  outputVolume,
} from "./commonIO.js";

const { input, output } = DflowNode;

export class Candles extends DflowNode {
  static kind = "candles";
  static inputs = [
    inputSymbol,
    inputInterval,
    input("number", { name: "count" }),
  ];
  static outputs = [
    outputOpen,
    outputHigh,
    outputLow,
    outputClose,
    outputVolume,
  ];
  async run() {
    const { binance, time: currentTime } = this.host.context as Context;
    const symbol = this.input(0).data as string;
    const interval = this.input(1).data as string;
    const count = this.input(2).data as number;
    const isBinanceSymbol = await binance.isBinanceSymbol(symbol);
    if (
      !isBinanceSymbol ||
      !isBinanceKlineInterval(interval) ||
      !isDflowBinanceKlineInterval(interval)
    )
      return this.clearOutputs();
    const data: BinanceKline[] = [];
    const klines = await binance.klines(symbol, interval, {
      endTime: currentTime,
      limit: count,
    });
    data.push(...klines);
    const { open, high, low, close, volume } = data.reduce<{
      open: number[];
      high: number[];
      low: number[];
      close: number[];
      volume: number[];
    }>(
      ({ open, high, low, close, volume }, kline) => ({
        open: [...open, decimalToNumber(kline[1])],
        high: [...high, decimalToNumber(kline[2])],
        low: [...low, decimalToNumber(kline[3])],
        close: [...close, decimalToNumber(kline[4])],
        volume: [...volume, decimalToNumber(kline[5])],
      }),
      {
        open: [],
        high: [],
        low: [],
        close: [],
        volume: [],
      }
    );
    this.output(0).data = open;
    this.output(1).data = high;
    this.output(2).data = low;
    this.output(3).data = close;
    this.output(4).data = volume;
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
    if (Dflow.isNumber(price)) this.output(0).data = price;
  }
}
