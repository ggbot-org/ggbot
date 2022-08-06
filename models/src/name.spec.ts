import { ErrorInvalidName, ErrorNameToLong } from "./errors";
import { isName, throwIfInvalidName, maxNameLength } from "./name";

const invalidNames = ["", "     "];
const nameTooLong = "x".repeat(maxNameLength + 1);

describe("isName", () => {
  it("validates string as name or throws", () => {
    [
      { input: "valid name", output: true },
      ...invalidNames
        .concat(nameTooLong)
        .map((input) => ({ input, output: false })),
    ].forEach(({ input, output }) => {
      expect(isName(input)).toBe(output);
    });
  });
});

describe("throwIfInvalidName", () => {
  it("throws ErrorInvalidName", () => {
    invalidNames.forEach((value) => {
      expect(() => {
        throwIfInvalidName(value);
      }).toThrow(ErrorInvalidName);
    });
  });

  it("throws ErrorNameToLong", () => {
    expect(() => {
      throwIfInvalidName(nameTooLong);
    }).toThrow(ErrorNameToLong);
  });
});
