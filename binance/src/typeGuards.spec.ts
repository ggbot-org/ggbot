import { isBinanceKlineOptionalParameters } from "./typeGuards";

describe("isBinanceKlineOptionalParameters", () => {
  it("works", () => {
    [
      {
        input: {
          startTime: "not a number",
          endTime: undefined,
          limit: undefined,
        },
        output: false,
      },
      {
        input: {
          startTime: undefined,
          endTime: "not a number",
          limit: undefined,
        },
        output: false,
      },
      {
        input: {
          startTime: undefined,
          endTime: undefined,
          limit: "not a number",
        },
        output: false,
      },
      {
        input: { startTime: undefined, endTime: undefined, limit: 10 },
        output: true,
      },
      {
        input: {
          startTime: new Date("2022-01-01").getTime(),
          endTime: new Date("2022-01-10").getTime(),
          limit: undefined,
        },
        output: true,
      },
      {
        input: {
          // startTime is after endTime
          startTime: new Date("2025-01-01").getTime(),
          endTime: new Date("2022-01-10").getTime(),
          limit: undefined,
        },
        output: false,
      },
    ].forEach(({ input, output }) => {
      expect(isBinanceKlineOptionalParameters(input)).toBe(output);
    });
  });
});
