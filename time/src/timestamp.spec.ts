import { isTimestamp, truncateTimestamp } from "./timestamp.js";

describe("isTimestamp", () => {
  it("validates string if is valid Timestamp", () => {
    [
      { input: "not a date", output: false },
      { input: "2000-01-01", output: false },
      { input: "2022-07-23T11:43:05.841Z", output: true },
    ].forEach(({ input, output }) => {
      expect(isTimestamp(input)).toBe(output);
    });
  });
});

describe("truncateTimestamp", () => {
  it("truncates a timestamp to given granularity", () => {
    [
      {
        input: { value: "2022-07-23T11:43:05.841Z", to: "second" },
        output: "2022-07-23T11:43:05.000Z",
      },
      {
        input: { value: "2022-07-23T11:43:05.841Z", to: "minute" },
        output: "2022-07-23T11:43:00.000Z",
      },
      {
        input: { value: "2022-07-23T11:43:05.841Z", to: "hour" },
        output: "2022-07-23T11:00:00.000Z",
      },
    ].forEach(({ input, output }) => {
      expect(truncateTimestamp(input)).toBe(output);
    });
  });
});
