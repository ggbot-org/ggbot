import { wilderSmoothing } from "./wilderSmoothing";

describe("Wilder's smoothing", () => {
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
          82.43, 82.57, 82.62, 82.9, 83.23, 83.45, 83.87, 84.4, 84.9, 85.47,
          85.84,
        ],
      },
    ].forEach(({ input: { values, period }, output }) => {
      expect(wilderSmoothing(values, period)).toStrictEqual(output);
    });
  });
});
