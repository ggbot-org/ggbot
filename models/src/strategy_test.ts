import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { nullId } from "./item.js";
import { normalizeName } from "./name.js";
import { invalidNames } from "./name_test.js";
import { isStrategy, newStrategy } from "./strategy.js";
import { createdNow } from "./time.js";

describe("isStrategy", () => {
  it("validates Strategy", () => {
    const accountId = nullId;
    const kind = "binance";
    const name = "Name";
    const { whenCreated } = createdNow();
    [
      {
        input: newStrategy({ accountId, kind, name }),
        output: true,
      },
      {
        input: { id: "not an id", kind, accountId, name, whenCreated },
        output: false,
      },
      {
        input: { id: nullId, accountId, whenCreated: "not a timestamp" },
        output: false,
      },
      ...invalidNames.map((invalidName) => ({
        input: {
          id: nullId,
          kind,
          accountId,
          whenCreated,
          name: normalizeName(invalidName),
        },
        output: false,
      })),
    ].forEach(({ input, output }) => {
      assert.equal(
        isStrategy(input),
        output,
        `isStrategy(${JSON.stringify(input)}) !== ${output}`
      );
    });
  });
});
