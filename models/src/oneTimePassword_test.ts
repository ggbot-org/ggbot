import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { createdNow } from "./time.js";
import {
  generateOneTimePassword,
  isOneTimePassword,
} from "./oneTimePassword.js";

describe("isOneTimePassword", () => {
  it("validates input if is valid OneTimePassword", () => {
    [
      {
        input: { code: "123456", ...createdNow() },
        output: true,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isOneTimePassword(input), output);
    });
  });
});

describe("generateOneTimePassword", () => {
  it("generates a OneTimePassword", () => {
    assert.ok(isOneTimePassword(generateOneTimePassword()));
  });
});
