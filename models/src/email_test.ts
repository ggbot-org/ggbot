import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isEmailAddress, normalizeEmailAddress } from "./email.js";
import { ErrorInvalidEmailAddress } from "./errors.js";

describe("normalizeEmailAddress", () => {
  it("returns email in lowercase", () => {
    [
      { input: "lower@example.com", output: "lower@example.com" },
      { input: "MiXeD@example.com", output: "mixed@example.com" },
    ].forEach(({ input, output }) => {
      if (!isEmailAddress(input)) throw new ErrorInvalidEmailAddress(input);
      assert.equal(normalizeEmailAddress(input), output);
    });
  });

  it("removes period characters", () => {
    [
      { input: "john.smith@gmail.com", output: "johnsmith@gmail.com" },
      { input: "jOhN.sMiTh@gmail.com", output: "johnsmith@gmail.com" },
      { input: "MiXeD.cAsE@example.com", output: "mixedcase@example.com" },
      { input: "u.s.e.r@example.com", output: "user@example.com" },
    ].forEach(({ input, output }) => {
      if (!isEmailAddress(input)) throw new ErrorInvalidEmailAddress(input);
      assert.equal(normalizeEmailAddress(input), output);
    });
  });

  it("removes labels", () => {
    [{ input: "user+label@example.com", output: "user@example.com" }].forEach(
      ({ input, output }) => {
        if (!isEmailAddress(input)) throw new ErrorInvalidEmailAddress(input);
        assert.equal(normalizeEmailAddress(input), output);
      }
    );
  });
});

describe("isEmailAddress", () => {
  it("validates email", () => {
    [
      { input: undefined, output: false },
      { input: "not an email", output: false },
      { input: "john.smith at gmail.com", output: false },
      { input: "john.smith@gmail.com", output: true },
      { input: "jOhN.sMiTh@gmail.com", output: true },
      { input: "john.smith+label@gmail.com", output: true },
      { input: "john.smith@example.co", output: true },
    ].forEach(({ input, output }) => {
      assert.equal(isEmailAddress(input), output);
    });
  });
});