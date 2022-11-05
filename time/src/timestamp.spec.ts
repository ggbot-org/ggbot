import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getTimestampFromDate,
  getTimestampFromDay,
  isTimestamp,
  truncateTimestamp,
} from "./timestamp.js";

describe("isTimestamp", () => {
  it("validates string if is valid Timestamp", () => {
    [
      { input: "not a date", output: false },
      { input: "2000-01-01", output: false },
      { input: "2022-07-23T11:43:05.841Z", output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isTimestamp(input), output);
    });
  });
});

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
    ].forEach(({ input: { timestamp, truncation }, output }) => {
      assert.equal(truncateTimestamp(timestamp).to(truncation), output);
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
