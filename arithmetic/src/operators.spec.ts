import { equal, mul } from "./operators";

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

describe("mul", () => {
  it("implements multiplication", () => {
    [
      {
        input: { a: "0.00096000", b: "20649.57000000", numDecimals: 8 },
        output: "19.82358720",
      },
    ].forEach(({ input: { a, b, numDecimals }, output }) => {
      expect(mul(a, b, numDecimals)).toBe(output);
    });
  });
});
