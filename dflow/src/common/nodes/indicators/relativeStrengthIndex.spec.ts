import { rsi } from "./relativeStrengthIndex";

describe("Relative Strength Index", () => {
  it("works", () => {
    [{ input: { values: [], period: 1 }, output: [] }].forEach(
      ({ input: { values, period }, output }) => {
        expect(rsi(values, period)).toStrictEqual(output);
      }
    );
  });
});
