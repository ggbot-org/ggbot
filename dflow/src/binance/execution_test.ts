import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getBalancesFromExecutionSteps,
  getOrdersFromExecutionSteps,
} from "./execution.js";
import { BinanceClientMock } from "./mocks/client.js";

describe("getBalancesFromExecutionSteps", () => {
  it("works", async () => {
    const binance = new BinanceClientMock();
    const { symbols } = await binance.exchangeInfo();
    [
      {
        input: [],
        output: [],
      },
    ].forEach(({ input, output }) => {
      assert.deepEqual(getBalancesFromExecutionSteps(symbols, input), output);
    });
  });
});

describe("getOrdersFromExecutionSteps", () => {
  it("works", () => {
    [
      {
        input: [],
        output: [],
      },
    ].forEach(({ input, output }) => {
      assert.deepEqual(getOrdersFromExecutionSteps(input), output);
    });
  });
});
