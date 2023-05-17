import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { isAccount, newAccount } from "./account.js";
import { nullId } from "./item.js";
import { normalizeName } from "./name.js";
import { invalidNames } from "./name_test.js";
import { createdNow } from "./time.js";

describe("isAccount", () => {
  it("validates Account, name is optional", () => {
    const email = "user@example.com";
    const { whenCreated } = createdNow();
    [
      {
        input: newAccount({ email }),
        output: true,
      },
      {
        input: newAccount({ email, name: "Name" }),
        output: true,
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
      ...invalidNames.map((invalidName) => ({
        input: {
          id: nullId,
          email,
          whenCreated,
          name: normalizeName(invalidName),
        },
        output: false,
      })),
    ].forEach(({ input, output }) => {
      assert.equal(
        isAccount(input),
        output,
        `isAccount(${JSON.stringify(input)}) !== ${output}`
      );
    });
  });
});
