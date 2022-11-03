import { ErrorInvalidDate } from "./errors";
import { getDayFromDate, isDay } from "./day";

describe("getDayFromDate", () => {
  it("returns YYYY-MM-DD from date", () => {
    [{ input: new Date("2000-01-01"), output: "2000-01-01" }].forEach(
      ({ input, output }) => {
        expect(getDayFromDate(input)).toBe(output);
      }
    );
  });

  it("throws ErrorInvalidDate", () => {
    expect(() => getDayFromDate(new Date("0000-00-00"))).toThrow(
      ErrorInvalidDate
    );
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
      expect(isDay(input)).toBe(output);
    });
  });
});
