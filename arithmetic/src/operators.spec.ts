import { equal, add, sub, div, mul } from "./operators";

describe("equal", () => {
  it("checks if two MaybeDecimal values are equal considering their actual number of decimals", () => {
    [
      { input: { a: "0.00", b: 0 }, output: true },
      { input: { a: "0.001", b: 0 }, output: false },
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

describe("add", () => {
  it("implements addition", () => {
    [
      {
        input: { a: "0", b: "1", numDecimals: 2 },
        output: "1.00",
      },
    ].forEach(({ input: { a, b, numDecimals }, output }) => {
      expect(add(a, b, numDecimals)).toBe(output);
    });
  });
});

describe("sub", () => {
  it("implements subtraction", () => {
    [
      {
        input: { a: "0", b: "1", numDecimals: 2 },
        output: "-1.00",
      },
    ].forEach(({ input: { a, b, numDecimals }, output }) => {
      expect(sub(a, b, numDecimals)).toBe(output);
    });
  });
});

describe("mul", () => {
  it("implements multiplication", () => {
    [
      {
        input: { a: "1", b: "1", numDecimals: 2 },
        output: "1.00",
      },
      {
        input: { a: "0.00096000", b: "20649.57000000", numDecimals: 8 },
        output: "19.82358720",
      },
    ].forEach(({ input: { a, b, numDecimals }, output }) => {
      expect(mul(a, b, numDecimals)).toBe(output);
    });
  });
});

describe("div", () => {
  it("implements division", () => {
    [
      {
        input: { a: "1", b: "1", numDecimals: 2 },
        output: "1.00",
      },
    ].forEach(({ input: { a, b, numDecimals }, output }) => {
      expect(div(a, b, numDecimals)).toBe(output);
    });
  });
});
