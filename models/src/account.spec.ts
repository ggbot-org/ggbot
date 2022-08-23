import { isAccount } from "./account";

import { testId0 } from "./item.spec";

describe("isAccount", () => {
  it("validates Account, name is optional", () => {
    const email = "user@example.com";
    const whenCreated = "2022-01-01T19:00:00.000Z";
    [
      {
        input: { id: testId0, email, whenCreated },
        output: true,
      },
      {
        input: { id: testId0, email, whenCreated, name: "Name" },
        output: true,
      },
    ].forEach(({ input, output }) => {
      expect(isAccount(input)).toBe(output);
    });
  });
});
