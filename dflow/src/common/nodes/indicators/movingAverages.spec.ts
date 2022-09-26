import { ema, getMovingValues, sma } from "./movingAverages";

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
    [
      { input: { values: [], period: 1 }, output: [] },
      {
        input: {
          values: [
            81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36,
            85.53, 86.54, 86.89, 87.77, 87.29,
          ],
          period: 5,
        },
        output: [
          82.43, 82.74, 83.09, 83.32, 83.63, 83.78, 84.25, 84.99, 85.57, 86.22,
          86.8,
        ],
      },
    ].forEach(({ input: { values, period }, output }) => {
      expect(sma(values, period)).toStrictEqual(output);
    });
  });
});

describe("getMovingValues", () => {
  it("returns a rolling set of values", () => {
    const array = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    [
      { input: { period: 2, index: 0, array }, output: [] },
      { input: { period: 2, index: 1, array }, output: [10, 11] },
      { input: { period: 3, index: 2, array }, output: [10, 11, 12] },
      { input: { period: 4, index: 4, array }, output: [14, 15, 16, 17] },
    ].forEach(({ input: { period, index, array }, output }) => {
      expect(getMovingValues(period, index, array)).toBe(output);
    });
  });
});
