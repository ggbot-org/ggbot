import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isDecimal, isMaybeDecimal, numOfDecimals } from "./decimal.js";

const validDecimals = [
  "0",
  "0.1",
  "0.12",
  "10",
  "11.0",
  "-1",
  "-1.2",
  "0.00100000",
  "100000.00000000",
];

const invalidDecimals = [
  "x",
  undefined,
  NaN,
  Infinity,
  // Exponential notation
  // (1234.5).toPrecision(2)) === '1.2e+3'
  "1.2+e3",
];

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
      assert.equal(input1 > input2, output);
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
      assert.equal(input1 < input2, output);
    });
  });
});

describe("isDecimal", () => {
  it("checks that argument is a Decimal", () => {
    const validArgs = [...validDecimals];
    const invalidArgs = [...invalidDecimals];
    [
      ...validArgs.map((input) => ({ input, output: true })),
      ...invalidArgs.map((input) => ({ input, output: false })),
    ].forEach(({ input, output }) => {
      assert.equal(isDecimal(input), output);
    });
  });
});

describe("isMaybeDecimal", () => {
  it("checks that argument can be converted to Decimal", () => {
    const validArgs = [1, -1, ...validDecimals];
    const invalidArgs = [...invalidDecimals];
    [
      ...validArgs.map((input) => ({ input, output: true })),
      ...invalidArgs.map((input) => ({ input, output: false })),
    ].forEach(({ input, output }) => {
      assert.equal(isMaybeDecimal(input), output);
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
      { input: "100000.00000000", output: 0 },
      { input: "0.00010000", output: 4 },
    ].forEach(({ input, output }) => {
      assert.equal(numOfDecimals(input), output);
    });
  });
});
