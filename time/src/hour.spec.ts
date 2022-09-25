import { isHour } from "./hour";

describe("isHour", () => {
  it("validates string if is a valid Hour", () => {
    [
      { input: "not an hour", output: false },
      { input: "1", output: false },
      { input: "24", output: false },
      { input: "99", output: false },
      { input: "00", output: true },
      { input: "01", output: true },
      { input: "02", output: true },
      { input: "03", output: true },
      { input: "04", output: true },
      { input: "05", output: true },
      { input: "06", output: true },
      { input: "07", output: true },
      { input: "08", output: true },
      { input: "09", output: true },
      { input: "10", output: true },
      { input: "11", output: true },
      { input: "12", output: true },
      { input: "13", output: true },
      { input: "14", output: true },
      { input: "15", output: true },
      { input: "16", output: true },
      { input: "17", output: true },
      { input: "18", output: true },
      { input: "19", output: true },
      { input: "20", output: true },
      { input: "21", output: true },
      { input: "23", output: true },
      { input: "23", output: true },
    ].forEach(({ input, output }) => {
      expect(isHour(input)).toBe(output);
    });
  });
});
