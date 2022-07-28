import { isItemId } from "./item";

describe("isItemId", () => {
  it("validates id as UUID", () => {
    [
      { input: "", output: false },
      { input: "0223b95a-a6e0-4856-bbda-ea3bbda38fdb", output: true },
    ].forEach(({ input, output }) => {
      expect(isItemId(input)).toBe(output);
    });
  });
});
