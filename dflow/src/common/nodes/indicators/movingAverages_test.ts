import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  exponentialMovingAverage,
  simpleMovingAverage,
  wilderSmoothing,
} from "./movingAverages.js";

describe("Exponential Moving Average", () => {
  it("works", () => {
    [
      { input: { values: [], period: 1 }, output: [] },
      {
        input: {
          values: [
            81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36,
            85.53, 86.54, 86.89, 87.77, 87.29,
          ],
          period: 5,
        },
        output: [
          81.59, 81.41, 81.9, 82.27, 82.71, 82.86, 82.85, 83.23, 83.67, 83.9,
          84.44, 85.14, 85.73, 86.41, 86.7,
        ],
      },
    ].forEach(({ input: { values, period }, output }) => {
      assert.deepEqual(exponentialMovingAverage(values, period), output);
    });
  });
});

describe("Simple Moving Average", () => {
  it("works", () => {
    [
      { input: { values: [], period: 1 }, output: [] },
      {
        input: {
          values: [
            81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36,
            85.53, 86.54, 86.89, 87.77, 87.29,
          ],
          period: 5,
        },
        output: [
          82.43, 82.74, 83.09, 83.32, 83.63, 83.78, 84.25, 84.99, 85.57, 86.22,
          86.8,
        ],
      },
    ].forEach(({ input: { values, period }, output }) => {
      assert.deepEqual(simpleMovingAverage(values, period), output);
    });
  });
});

describe("Wilder's smoothing", () => {
  it("works", () => {
    [
      { input: { values: [], period: 1 }, output: [] },
      {
        input: {
          values: [
            81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36,
            85.53, 86.54, 86.89, 87.77, 87.29,
          ],
          period: 5,
        },
        output: [
          82.43, 82.57, 82.62, 82.9, 83.23, 83.45, 83.87, 84.4, 84.9, 85.47,
          85.84,
        ],
      },
    ].forEach(({ input: { values, period }, output }) => {
      assert.deepEqual(wilderSmoothing(values, period), output);
    });
  });
});
