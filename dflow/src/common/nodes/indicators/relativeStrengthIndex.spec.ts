import { rsi } from "./relativeStrengthIndex";

describe("Relative Strength Index", () => {
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
          72.03, 64.93, 75.94, 79.8, 77.71, 83.03, 87.48, 88.76, 91.48, 78.5,
        ],
      },
    ].forEach(({ input: { values, period }, output }) => {
      expect(rsi(values, period)).toStrictEqual(output);
    });
  });
});
