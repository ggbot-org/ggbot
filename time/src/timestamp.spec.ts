import { isTimestamp } from "./timestamp";

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