import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAccount } from "./account.js";
import { nullId } from "./item.js";

describe("isAccount", () => {
  it("validates Account, name is optional", () => {
    const email = "user@example.com";
    const whenCreated = "2022-01-01T19:00:00.000Z";
    const invalidName = "";
    [
      {
        input: { id: nullId, email, whenCreated },
        output: true,
      },
      {
        input: { id: nullId, email, whenCreated, name: "Name" },
        output: true,
      },
      {
        input: { id: nullId, email, whenCreated, name: invalidName },
        output: false,
      },
      {
        input: { id: "not an id", email, whenCreated },
        output: false,
      },
      {
        input: { id: nullId, email: "not an email", whenCreated },
        output: false,
      },
      {
        input: { id: nullId, email, whenCreated: "not a timestamp" },
        output: false,
      },
    ].forEach(({ input, output }) => {
      assert.equal(isAccount(input), output);
    });
  });
});
