import { equal, isDecimal, numOfDecimals } from "./arithmetic";

describe("equal", () => {
  it("checks if two Decimal numbers are equal considering their number of decimals", () => {
    [
      { input: { a: "1", b: "-1" }, output: false },
      { input: { a: "1", b: "1" }, output: true },
      { input: { a: "1.0", b: "1" }, output: true },
      { input: { a: "1.02", b: "1.020" }, output: true },
      { input: { a: "-1.2300", b: "-1.230" }, output: true },
    ].forEach(({ input: { a, b }, output }) => {
      expect(equal(a, b)).toBe(output);
    });
  });
});

describe("isDecimal", () => {
  it("validates value as Decimal", () => {
    const validDecimals = ["0", "0.1", "0.12", "10", "11.0", "-1", "-1.2"];
    const invalidDecimals = [
      "x",
      undefined,
      NaN,
      // Exponential notation
      // (1234.5).toPrecision(2)) === '1.2e+3'
      "1.2+e3",
    ];
    [
      ...validDecimals.map((input) => ({ input, output: true })),
      ...invalidDecimals.map((input) => ({ input, output: false })),
    ].forEach(({ input, output }) => {
      expect(isDecimal(input)).toBe(output);
    });
  });
});

describe("numOfDecimals", () => {
  it("return number of digits in mantissa part", () => {
    [
      { input: "0", output: 0 },
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
