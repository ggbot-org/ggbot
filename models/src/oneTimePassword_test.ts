import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isOneTimePassword } from "./oneTimePassword.js";

describe("isOneTimePassword", () => {
  it("validates value if is valid OneTimePassword", () => {
    [
      {
        input: { code: "roakhk", whenCreated: "2022-07-24T14:53:11.513Z" },
        output: true,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isOneTimePassword(input), output);
    });
  });
});
