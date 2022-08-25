import { ema, sma } from "./movingAverages";

describe("Exponential Moving Average", () => {
  it("works", () => {
    [{ input: { values: [], period: 1 }, output: [] }].forEach(
      ({ input: { values, period }, output }) => {
        expect(ema(values, period)).toStrictEqual(output);
      }
    );
  });
});

describe("Simple Moving Average", () => {
  it("works", () => {
    [{ input: { values: [], period: 1 }, output: [] }].forEach(
      ({ input: { values, period }, output }) => {
        expect(sma(values, period)).toStrictEqual(output);
      }
    );
  });
});
