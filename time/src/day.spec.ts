import { getDayFromDate, isDay } from "./day";

describe("getDayFromDate", () => {
  it("returns YYYY-MM-DD from date", () => {
    [{ input: new Date("2000-01-01"), output: "2000-01-01" }].forEach(
      ({ input, output }) => {
        expect(getDayFromDate(input)).toBe(output);
      }
    );
  });

  it("handles invalid dates", () => {
    [{ input: new Date("0000-00-00"), output: null }].forEach(
      ({ input, output }) => {
        expect(getDayFromDate(input)).toBe(output);
      }
    );
  });
});

describe("isDay", () => {
  it("validates day in YYYY-MM-DD format", () => {
    [{ input: "not a date", output: false }].forEach(({ input, output }) => {
      expect(isDay(input)).toBe(output);
    });
  });
});
