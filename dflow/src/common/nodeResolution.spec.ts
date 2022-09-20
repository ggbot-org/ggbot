import {commonNodeTextToViewType} from "./nodeResolution";

describe("nodeTextToViewType", () => {
  it("resolves node containing comments to `info` type", () => {
    [
      {input: "this is a comment, it contains spaces", output: "info"},
      {input: "this\nis\na\ncomment", output: "info"},
    ].forEach(({input, output}) => {
      expect(commonNodeTextToViewType(input)).toBe(output);
    });

    expect(commonNodeTextToViewType("thisCouldBeSomeNode")).toBe(undefined);
  });

  it("resolves node containing JSON to `json` type", () => {
    [
      {input: "1", output: "json"},
      {input: "true", output: "json"},
      {input: "false", output: "json"},
      {input: '{"message":"hello world"}', output: "json"},
      {input: "[ 1 ]", output: "json"},
    ].forEach(({input, output}) => {
      expect(commonNodeTextToViewType(input)).toBe(output);
    });
  });
});
