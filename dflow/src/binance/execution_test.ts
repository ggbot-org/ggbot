import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getBalancesFromExecutionSteps,
  getOrdersFromExecutionSteps,
} from "./execution.js";

describe("getBalancesFromExecutionSteps", () => {
  it("works", () => {
    [
      {
        input: [],
        output: [],
      },
    ].forEach(({ input, output }) => {
      assert.deepEqual(getBalancesFromExecutionSteps(input), output);
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
