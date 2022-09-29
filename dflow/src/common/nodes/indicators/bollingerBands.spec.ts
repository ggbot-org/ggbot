import { bollingerBands } from "./bollingerBands";

describe("Bollinger Bands", () => {
  it("works", () => {
    [
      { input: { values: [], period: 1, amplitude: 2 }, output: [[], [], []] },
      {
        input: {
          values: [
            81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36,
            85.53, 86.54, 86.89, 87.77, 87.29,
          ],
          period: 5,
          amplitude: 2,
        },
        output: [
          [
            80.53, 80.99, 82.53, 82.48, 82.42, 82.44, 82.5, 83.14, 83.53, 83.87,
            85.28,
          ],
          [
            82.43, 82.74, 83.09, 83.32, 83.63, 83.78, 84.25, 84.99, 85.57,
            86.22, 86.8,
          ],
          [
            84.33, 84.49, 83.65, 84.16, 84.84, 85.12, 86.0, 86.84, 87.61, 88.57,
            88.32,
          ],
        ],
      },
    ].forEach(({ input: { values, period, amplitude }, output }) => {
      expect(bollingerBands(values, period, amplitude)).toStrictEqual(output);
    });
  });
});
