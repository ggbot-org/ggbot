import { canBeDecimal, numOfDecimals } from "./decimal";

describe("Decimal", () => {
  it('supports "Greater than" operator', () => {
    [
      {
        input1: "0",
        input2: "1",
        output: false,
      },
      {
        input1: "1",
        input2: "0",
        output: true,
      },
      {
        input1: "1.12",
        input2: "1.01",
        output: true,
      },
    ].forEach(({ input1, input2, output }) => {
      expect(input1 > input2).toBe(output);
    });
  });

  it('supports "Less than" operator', () => {
    [
      {
        input1: "1",
        input2: "0",
        output: false,
      },
      {
        input1: "0",
        input2: "1",
        output: true,
      },
    ].forEach(({ input1, input2, output }) => {
      expect(input1 < input2).toBe(output);
    });
  });
});

describe("canBeDecimal", () => {
  it("checks argument can be converted to Decimal", () => {
    const validArgs = [1, -1, "0", "0.1", "0.12", "10", "11.0", "-1", "-1.2"];
    const invalidArgs = [
      "x",
      undefined,
      NaN,
      Infinity,
      // Exponential notation
      // (1234.5).toPrecision(2)) === '1.2e+3'
      "1.2+e3",
    ];
    [
      ...validArgs.map((input) => ({ input, output: true })),
      ...invalidArgs.map((input) => ({ input, output: false })),
    ].forEach(({ input, output }) => {
      expect(canBeDecimal(input)).toBe(output);
    });
  });
});

describe("numOfDecimals", () => {
  it("return number of digits in mantissa part", () => {
    [
      { input: "0", output: 0 },
      { input: "0.0", output: 0 },
      { input: "1.00", output: 0 },
      { input: "0.1", output: 1 },
      { input: "0.12", output: 2 },
      { input: "0.1200", output: 2 },
      { input: "0.12003", output: 5 },
      { input: "-1", output: 0 },
      { input: "-1.2", output: 1 },
      { input: "-1.200", output: 1 },
    ].forEach(({ input, output }) => {
      expect(numOfDecimals(input)).toBe(output);
    });
  });
});
