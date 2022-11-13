import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isDay, isHour, isTimestamp, isTimeUnit } from "./time.js";

describe("isHour", () => {
  it("validates string if is a valid Hour", () => {
    [
      { input: "not an hour", output: false },
      { input: "1", output: false },
      { input: "24", output: false },
      { input: "99", output: false },
      { input: "00", output: true },
      { input: "01", output: true },
      { input: "02", output: true },
      { input: "03", output: true },
      { input: "04", output: true },
      { input: "05", output: true },
      { input: "06", output: true },
      { input: "07", output: true },
      { input: "08", output: true },
      { input: "09", output: true },
      { input: "10", output: true },
      { input: "11", output: true },
      { input: "12", output: true },
      { input: "13", output: true },
      { input: "14", output: true },
      { input: "15", output: true },
      { input: "16", output: true },
      { input: "17", output: true },
      { input: "18", output: true },
      { input: "19", output: true },
      { input: "20", output: true },
      { input: "21", output: true },
      { input: "23", output: true },
      { input: "23", output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isHour(input), output);
    });
  });
});

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
