import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { crossOver } from "./cross.js";

describe("CrossOver", () => {
  it("works", () => {
    [
      { input: { values1: [], values2: [] }, output: [] },
      {
        input: {
          values1: [
            81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36, 85.53, 86.54, 86.89, 87.77,
            87.29,
          ],
          values2: [
            81.85, 81.2, 81.55, 82.91, 83.1, 83.41, 82.71, 82.7, 84.2, 84.25, 84.03, 85.45, 86.18, 88.0,
            87.6,
          ],
        },
        output: [0, 1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
      },
    ].forEach(({ input: { values1, values2 }, output }) => {
      assert.deepEqual(crossOver(values1, values2), output);
    });
  });
});