import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nodeTextToViewType } from "./nodeResolution.js";

describe("nodeTextToViewType", () => {
  it("resolves node containing comments to `info` type", () => {
    [
      { input: "this is a comment, it contains spaces", output: "info" },
      { input: "this\nis\na\ncomment", output: "info" },
    ].forEach(({ input, output }) => {
      assert.equal(nodeTextToViewType(input), output);
    });

    assert.equal(nodeTextToViewType("thisCouldBeSomeNode"), undefined);
  });

  it("resolves node containing JSON to `json` type", () => {
    [
      { input: "1", output: "json" },
      { input: "true", output: "json" },
      { input: "false", output: "json" },
      { input: '{"message":"hello world"}', output: "json" },
      { input: "[ 1 ]", output: "json" },
    ].forEach(({ input, output }) => {
      assert.equal(nodeTextToViewType(input), output);
    });
  });
});
