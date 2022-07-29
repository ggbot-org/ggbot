import { isName } from "./name";

describe("isName", () => {
  it("validates string as name", () => {
    [
      { input: "valid name", output: true },
      { input: "", output: false },
      { input: "     ", output: false },
    ].forEach(({ input, output }) => {
      expect(isName(input)).toBe(output);
    });
  });
});
