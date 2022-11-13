import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { datetoDay, dateToTimestamp, dayToTimestamp } from "./conversions.js";

describe("datetoDay", () => {
  it("returns YYYY-MM-DD from date", () => {
    [{ input: new Date("2000-01-01"), output: "2000-01-01" }].forEach(
      ({ input, output }) => {
        assert.equal(datetoDay(input), output);
      }
    );
  });

  it("throws ErrorInvalidDate", () => {
    assert.throws(() => datetoDay(new Date("0000-00-00")), {
      name: "ErrorInvalidDate",
    });
  });
});

describe("dayToTimestamp", () => {
  it("truncates a timestamp to its day", () => {
    [
      {
        input: "2022-07-23",
        output: "2022-07-23T00:00:00.000Z",
      },
    ].forEach(({ input, output }) => {
      assert.equal(dayToTimestamp(input), output);
    });
  });
});

describe("dateToTimestamp", () => {
  it("throws ErrorInvalidDate", () => {
    assert.throws(() => dateToTimestamp(new Date("0000-00-00")), {
      name: "ErrorInvalidDate",
    });
  });
});
