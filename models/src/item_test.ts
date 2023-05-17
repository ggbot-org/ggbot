import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { isItemId, nullId } from "./item.js";

describe("isItemId", () => {
  it("validates id as UUID", () => {
    [
      { input: undefined, output: false },
      { input: 1000, output: false },
      { input: "", output: false },
      { input: nullId, output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isItemId(input), output);
    });
  });
});
