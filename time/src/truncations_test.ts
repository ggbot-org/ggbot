import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { truncateTimestamp } from "./truncations.js";

describe("truncateTimestamp", () => {
  it("truncates a timestamp to given granularity", () => {
    [
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "second" },
        output: "2022-07-23T11:43:05.000Z",
      },
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "minute" },
        output: "2022-07-23T11:43:00.000Z",
      },
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "hour" },
        output: "2022-07-23T11:00:00.000Z",
      },
      {
        input: { timestamp: "2022-07-23T11:43:05.841Z", truncation: "day" },
        output: "2022-07-23T00:00:00.000Z",
      },
    ].forEach(({ input: { timestamp, truncation }, output }) => {
      assert.equal(truncateTimestamp(timestamp).to[truncation](), output);
    });
  });
});
