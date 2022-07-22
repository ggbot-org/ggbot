import { isEmailAddress, normalizeEmailAddress } from "./email";

describe("normalizeEmailAddress", () => {
  it("returns email in lowercase", () => {
    [
      { input: "lower@example.com", expected: "lower@example.com" },
      { input: "MiXeD@example.com", expected: "mixed@example.com" },
    ].forEach(({ input, expected }) => {
      if (!isEmailAddress(input))
        throw new TypeError(`Invalid EmailAddress ${input}`);
      expect(normalizeEmailAddress(input)).toBe(expected);
    });
  });

  it("removes period characters", () => {
    [
      { input: "john.smith@gmail.com", expected: "johnsmith@gmail.com" },
      { input: "jOhN.sMiTh@gmail.com", expected: "johnsmith@gmail.com" },
      { input: "MiXeD.cAsE@example.com", expected: "mixedcase@example.com" },
      { input: "u.s.e.r@example.com", expected: "user@example.com" },
    ].forEach(({ input, expected }) => {
      if (!isEmailAddress(input))
        throw new TypeError(`Invalid EmailAddress ${input}`);
      expect(normalizeEmailAddress(input)).toBe(expected);
    });
  });

  it("removes labels", () => {
    [{ input: "user+label@example.com", expected: "user@example.com" }].forEach(
      ({ input, expected }) => {
        if (!isEmailAddress(input))
          throw new TypeError(`Invalid EmailAddress ${input}`);
        expect(normalizeEmailAddress(input)).toBe(expected);
      }
    );
  });
});

describe("isEmailAddress", () => {
  it("validates email", () => {
    [
      { input: undefined, expected: false },
      { input: "not an email", expected: false },
      { input: "john.smith at gmail.com", expected: false },
      { input: "john.smith@gmail.com", expected: true },
      { input: "jOhN.sMiTh@gmail.com", expected: true },
      { input: "john.smith+label@gmail.com", expected: true },
      { input: "john.smith@example.co", expected: true },
    ].forEach(({ input, expected }) => {
      expect(isEmailAddress(input)).toBe(expected);
    });
  });
});
