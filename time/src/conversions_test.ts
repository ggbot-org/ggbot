import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTimestampFromDate, getTimestampFromDay } from "./conversions";

describe("getTimestampFromDay", () => {
  it("truncates a timestamp to its day", () => {
    [
      {
        input: "2022-07-23",
        output: "2022-07-23T00:00:00.000Z",
      },
    ].forEach(({ input, output }) => {
      assert.equal(getTimestampFromDay(input), output);
    });
  });
});

describe("getTimestampFromDate", () => {
  it("throws ErrorInvalidDate", () => {
    assert.throws(() => getTimestampFromDate(new Date("0000-00-00")), {
      name: "TypeError",
    });
  });
});
