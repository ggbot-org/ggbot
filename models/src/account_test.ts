import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAccount } from "./account.js";
import { testId0 } from "./item_test.js";

describe("isAccount", () => {
  it("validates Account, name is optional", () => {
    const email = "user@example.com";
    const whenCreated = "2022-01-01T19:00:00.000Z";
    [
      {
        input: { id: testId0, email, whenCreated },
        output: true,
      },
      {
        input: { id: testId0, email, whenCreated, name: "Name" },
        output: true,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isAccount(input), output);
    });
  });
});
