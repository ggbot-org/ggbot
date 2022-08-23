import { isItemId } from "./item";

export const testId0 = "00000000-0000-0000-0000-000000000000";

describe("isItemId", () => {
  it("validates id as UUID", () => {
    [
      { input: "", output: false },
      { input: testId0, output: true },
    ].forEach(({ input, output }) => {
      expect(isItemId(input)).toBe(output);
    });
  });
});
