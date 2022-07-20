import { isDay } from "./day";

describe("isDay", () => {
  it("validates day in YYYY-MM-DD format", () => {
    [{ input: "not a date", output: false }].forEach(({ input, output }) => {
      expect(isDay(input)).toBe(output);
    });
  });
});
