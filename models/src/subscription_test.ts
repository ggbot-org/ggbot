import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSubscription } from "./subscription.js";

describe("isSubscription", () => {
  it("validates Subscription", () => {
    [
      {
        input: {
          plan: "basic",
          end: "2022-01-01",
        },
        output: true,
      },
    ].forEach(({ input, output }) => {
      assert.equal(
        isSubscription(input),
        output,
        `isSubscription(${JSON.stringify(input)}) !== ${output}`
      );
    });
  });
});
