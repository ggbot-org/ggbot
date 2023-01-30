import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isDay } from "./day.js";

describe("isDay", () => {
  it("validates string if is a valid Day", () => {
    [
      { input: "not a date", output: false },
      { input: "0000-00-00", output: false },
      { input: "2000-01-99", output: false },
      { input: "2000-01-01", output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isDay(input), output);
    });
  });
});
