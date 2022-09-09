import { nodeTextToViewType } from "./nodeResolution";

describe("nodeTextToViewType", () => {
  it("resolves node containing comments to `info` type", () => {
    [
      { input: "this is a comment, it contains spaces", output: "info" },
      { input: "this\nis\na\ncomment", output: "info" },
    ].forEach(({ input, output }) => {
      expect(nodeTextToViewType(input)).toBe(output);
    });

    expect(nodeTextToViewType("thisCouldBeSomeNode")).toBe(undefined);
  });
});
