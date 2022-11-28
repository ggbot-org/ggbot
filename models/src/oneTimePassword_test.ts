import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  generateOneTimePassword,
  isOneTimePassword,
} from "./oneTimePassword.js";

describe("isOneTimePassword", () => {
  it("validates input if is valid OneTimePassword", () => {
    [
      {
        input: { code: "123456", whenCreated: "2022-07-24T14:53:11.513Z" },
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
