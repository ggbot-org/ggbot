import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  isBinanceKline,
  isBinanceKlineInterval,
  isBinanceKlineOptionalParameters,
  isBinanceSymbolFilterLotSize,
  isBinanceSymbolFilterMinNotional,
} from "./typeGuards.js";

describe("isBinanceKline", () => {
  it("works", () => {
    [
      {
        input: [
          1674259200000,
          "0.07316200",
          "0.07390800",
          "0.07115000",
          "0.07140000",
          "66387.19950000",
          1674345599999,
          "4790.90937830",
          120641,
          "29534.47870000",
          "2131.84019322",
          "0",
        ],
        output: true,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isBinanceKline(input), output);
    });
  });
});
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
          startTime: undefined,
          endTime: undefined,
          limit: undefined,
        },
        output: true,
      },
      {
        input: {
          startTime: "not a number",
          endTime: undefined,
          limit: undefined,
        },
        output: false,
      },
      {
        input: {
          startTime: undefined,
          endTime: "not a number",
          limit: undefined,
        },
        output: false,
      },
      {
        input: {
          startTime: undefined,
          endTime: undefined,
          limit: "not a number",
        },
        output: false,
      },
      {
        input: {
          startTime: -1,
          endTime: -1,
          limit: -1,
        },
        output: false,
      },
      {
        input: {
          startTime: undefined,
          endTime: undefined,
          limit: 10,
        },
        output: true,
      },
      {
        input: {
          startTime: new Date("2022-01-01").getTime(),
          endTime: new Date("2022-01-10").getTime(),
          limit: undefined,
        },
        output: true,
      },
      {
        input: {
          // start is after end
          startTime: new Date("2025-01-01").getTime(),
          endTime: new Date("2022-01-10").getTime(),
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
