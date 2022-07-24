import { isOneTimePassword } from "./oneTimePassword";

describe("isOneTimePassword", () => {
  it("validates value if is valid OneTimePassword", () => {
    [
      {
        input: { code: "roakhk", whenCreated: "2022-07-24T14:53:11.513Z" },
        output: true,
      },
    ].forEach(({ input, output }) => {
      expect(isOneTimePassword(input)).toBe(output);
    });
  });
});
