import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { ErrorInvalidDate } from "./errors.js";
import { getDate, truncateDate, truncateTimestamp } from "./operators.js";

describe("getDate", () => {
  it("throws ErrorInvalidDate", () => {
    assert.throws(
      () => {
        getDate(new Date("0000-00-00")).plus(2).days();
      },
      {
        name: "Error",
        message: ErrorInvalidDate.message,
      }
    );
  });

  // TODO more test cases
  it("works both with plus() and minus()", () => {
    // plus minutes
    [
      {
        input: { num: 0, date: new Date("1978-12-31") },
        output: new Date("1978-12-31"),
      },
      {
        input: { num: 1, date: new Date("1978-12-31T00:00") },
        output: new Date("1978-12-31T00:01"),
      },
    ].forEach(({ input: { num, date }, output }) => {
      assert.deepEqual(getDate(date).plus(num).minutes(), output);
    });

    // plus days
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
      assert.deepEqual(getDate(date).plus(num).days(), output);
    });

    // minus days
    [
      {
        input: { num: 1, date: new Date("1979-01-01") },
        output: new Date("1978-12-31"),
      },
      {
        input: { num: 365, date: new Date("1978-12-31") },
        output: new Date("1977-12-31"),
      },
      {
        input: { num: 2, date: new Date(1665187200000) },
        output: new Date(1665187200000 - 86400 * 1000 * 2),
      },
    ].forEach(({ input: { num, date }, output }) => {
      assert.deepEqual(getDate(date).minus(num).days(), output);
    });

    // plus years
    [
      {
        input: { num: 1, date: new Date("1978-12-31") },
        output: new Date("1979-12-31"),
      },
      {
        input: { num: 2, date: new Date("1978-12-31") },
        output: new Date("1980-12-31"),
      },
    ].forEach(({ input: { num, date }, output }) => {
      assert.deepEqual(getDate(date).plus(num).years(), output);
    });
  });
});

describe("truncateDate", () => {
  it("throws ErrorInvalidDate", () => {
    assert.throws(
      () => {
        truncateDate(new Date("0000-00-00")).to.day();
      },
      {
        name: "Error",
        message: ErrorInvalidDate.message,
      }
    );
  });
});

describe("truncateTimestamp", () => {
  it("truncates a timestamp to given granularity", () => {
    [
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "second" },
        output: "2022-07-23T11:43:05.000Z",
      },
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "minute" },
        output: "2022-07-23T11:43:00.000Z",
      },
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "hour" },
        output: "2022-07-23T11:00:00.000Z",
      },
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "day" },
        output: "2022-07-23T00:00:00.000Z",
      },
    ].forEach(({ input: { timestamp, truncation }, output }) => {
      assert.equal(truncateTimestamp(timestamp).to[truncation](), output);
    });
  });
});
