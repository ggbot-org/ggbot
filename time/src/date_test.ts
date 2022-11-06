import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDays, truncateDate } from "./date.js";

describe("addDays", () => {
  it("works", () => {
    [
      {
        input: { num: 0, date: new Date("1978-12-31") },
        output: new Date("1978-12-31"),
      },
      {
        input: { num: 1, date: new Date("1978-12-31") },
        output: new Date("1979-01-01"),
      },
      {
        input: { num: -365, date: new Date("1978-12-31") },
        output: new Date("1977-12-31"),
      },
      {
        input: { num: 2, date: new Date(1665187200000) },
        output: new Date(1665187200000 + 86400 * 1000 * 2),
      },
    ].forEach(({ input: { num, date }, output }) => {
      assert.deepEqual(addDays(num, date), output);
    });
  });
});

describe("truncateDate", () => {
  it("throws ErrorInvalidDate", () => {
    assert.throws(() => truncateDate(new Date("0000-00-00")), {
      name: "TypeError",
    });
  });
});
