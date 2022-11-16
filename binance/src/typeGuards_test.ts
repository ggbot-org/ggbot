import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isBinanceKlineInterval,
  isBinanceKlineOptionalParameters,
  isBinanceSymbolFilterLotSize,
  isBinanceSymbolFilterMinNotional,
} from "./typeGuards.js";

describe("isBinanceKlineInterval", () => {
  it("works", () => {
    [
      { input: "xx", output: false },
      { input: "1m", output: true },
      { input: "3m", output: true },
      { input: "5m", output: true },
      { input: "15m", output: true },
      { input: "30m", output: true },
      { input: "1h", output: true },
      { input: "2h", output: true },
      { input: "4h", output: true },
      { input: "6h", output: true },
      { input: "8h", output: true },
      { input: "12h", output: true },
      { input: "1d", output: true },
      { input: "3d", output: true },
      { input: "1w", output: true },
      { input: "1M", output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isBinanceKlineInterval(input), output);
    });
  });
});

describe("isBinanceKlineOptionalParameters", () => {
  it("works", () => {
    [
      {
        input: {
          start: "not a number",
          end: undefined,
          limit: undefined,
        },
        output: false,
      },
      {
        input: {
          start: undefined,
          end: "not a number",
          limit: undefined,
        },
        output: false,
      },
      {
        input: {
          start: undefined,
          end: undefined,
          limit: "not a number",
        },
        output: false,
      },
      {
        input: {
          start: undefined,
          end: undefined,
          limit: 10,
        },
        output: true,
      },
      {
        input: {
          start: new Date("2022-01-01").getTime(),
          end: new Date("2022-01-10").getTime(),
          limit: undefined,
        },
        output: true,
      },
      {
        input: {
          // start is after end
          start: new Date("2025-01-01").getTime(),
          end: new Date("2022-01-10").getTime(),
          limit: undefined,
        },
        output: false,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isBinanceKlineOptionalParameters(input), output);
    });
  });
});

describe("isBinanceSymbolFilterLotSize", () => {
  it("works", () => {
    [
      {
        input: {
          filterType: "LOT_SIZE",
          minQty: "0.00010000",
          maxQty: "100000.00000000",
          stepSize: "0.00010000",
        },
        output: true,
      },
      {
        input: {
          filterType: "XXX",
          minQty: "0.00010000",
          maxQty: "100000.00000000",
          stepSize: "0.00010000",
        },
        output: false,
      },
      {
        input: {
          filterType: "LOT_SIZE",
          minQty: "not a number",
          maxQty: "100000.00000000",
          stepSize: "0.00010000",
        },
        output: false,
      },
      {
        input: {
          filterType: "LOT_SIZE",
          minQty: "0.00010000",
          maxQty: "not a number",
          stepSize: "0.00010000",
        },
        output: false,
      },
      {
        input: {
          filterType: "LOT_SIZE",
          minQty: "0.00010000",
          maxQty: "100000.00000000",
          stepSize: "not a number",
        },
        output: false,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isBinanceSymbolFilterLotSize(input), output);
    });
  });
});

describe("isBinanceSymbolFilterMinNotional", () => {
  it("works", () => {
    [
      {
        input: {
          filterType: "MIN_NOTIONAL",
          minNotional: "0.00010000",
          applyToMarket: true,
          avgPriceMins: 5,
        },
        output: true,
      },
      {
        input: {
          filterType: "XXX",
          minNotional: "0.00010000",
          applyToMarket: true,
          avgPriceMins: 5,
        },
        output: false,
      },
      {
        input: {
          filterType: "MIN_NOTIONAL",
          minNotional: "not a number",
          applyToMarket: true,
          avgPriceMins: 5,
        },
        output: false,
      },
      {
        input: {
          filterType: "MIN_NOTIONAL",
          minNotional: "0.00010000",
          applyToMarket: "not a boolean",
          avgPriceMins: 5,
        },
        output: false,
      },
      {
        input: {
          filterType: "MIN_NOTIONAL",
          minNotional: "0.00010000",
          applyToMarket: true,
          avgPriceMins: "not a number",
        },
        output: false,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isBinanceSymbolFilterMinNotional(input), output);
    });
  });
});
