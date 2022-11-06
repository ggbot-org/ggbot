import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isItemId } from "./item.js";

export const testId0 = "00000000-0000-0000-0000-000000000000";

describe("isItemId", () => {
  it("validates id as UUID", () => {
    [
      { input: "", output: false },
      { input: testId0, output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isItemId(input), output);
    });
  });
});
