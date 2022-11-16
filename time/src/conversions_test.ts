import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ErrorInvalidDate } from "./errors.js";
import { dateToDay, dateToTimestamp, dayToTimestamp } from "./conversions.js";

describe("dateToDay", () => {
  it("returns YYYY-MM-DD from date", () => {
    [{ input: new Date("2000-01-01"), output: "2000-01-01" }].forEach(
      ({ input, output }) => {
        assert.equal(dateToDay(input), output);
      }
    );
  });

  it("throws ErrorInvalidDate", () => {
    assert.throws(() => dateToDay(new Date("0000-00-00")), {
      name: "Error",
      message: ErrorInvalidDate.message,
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
      name: "Error",
      message: ErrorInvalidDate.message,
    });
  });
});
