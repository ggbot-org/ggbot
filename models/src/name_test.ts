import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isName, throwIfInvalidName, maxNameLength } from "./name.js";

const invalidNames = ["", "     "];
const nameTooLong = "x".repeat(maxNameLength + 1);

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
  it("throws ErrorInvalidName", () => {
    invalidNames.forEach((value) => {
      assert.throws(
        () => {
          throwIfInvalidName(value);
        },
        { name: "TypeError" }
      );
    });
  });

  it("throws ErrorNameToLong", () => {
    assert.throws(
      () => {
        throwIfInvalidName(nameTooLong);
      },
      { name: "TypeError" }
    );
  });
});
