import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ErrorInvalidArg } from "./errors.js";
import { isName, throwIfInvalidName } from "./name.js";

const invalidNames = ["", "     "];
const nameTooLong = "x".repeat(999);

describe("isName", () => {
  it("validates string as name or throws", () => {
    [
      { input: "valid name", output: true },
      ...invalidNames
        .concat(nameTooLong)
        .map((input) => ({ input, output: false })),
    ].forEach(({ input, output }) => {
      assert.equal(isName(input), output);
    });
  });
});

describe("throwIfInvalidName", () => {
  it("throws ErrorInvalidArg", () => {
    [...invalidNames, nameTooLong].forEach((value) => {
      assert.throws(
        () => {
          throwIfInvalidName(value);
        },
        { name: "Error", message: ErrorInvalidArg.message("Name") }
      );
    });
  });
});
