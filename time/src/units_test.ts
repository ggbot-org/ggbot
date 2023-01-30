import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isTimeUnit } from "./units.js";

describe("isTimeUnit", () => {
  it("is TimeUnit type guard", () => {
    [
      { input: "not a TimeUnit", output: false },
      { input: "second", output: true },
      { input: "minute", output: true },
      { input: "hour", output: true },
      { input: "day", output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isTimeUnit(input), output);
    });
  });
});
