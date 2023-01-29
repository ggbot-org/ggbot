import { Time, TimeInterval } from "@ggbot2/time";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BinanceExchange } from "./exchange.js";
import {
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
} from "./types.js";

describe("coerceKlineOptionalParametersToTimeInterval", () => {
  it("works", () => {
    type TestDataItem = {
      input: {
        interval: BinanceKlineInterval;
        binanceKlineOptionalParameters: BinanceKlineOptionalParameters;
        currentTime?: Time;
      };
      output: TimeInterval;
    };

    const testData: TestDataItem[] = [
      {
        input: {
          interval: "1h",
          binanceKlineOptionalParameters: {
            startTime: new Date("2023-01-01T00:00").getTime(),
            endTime: new Date("2023-01-01T01:00").getTime(),
          },
        },
        output: {
          start: new Date("2023-01-01T00:00").getTime(),
          end: new Date("2023-01-01T01:00").getTime(),
        },
      },
      {
        input: {
          interval: "1h",
          binanceKlineOptionalParameters: {
            limit: 1,
            endTime: 1672531200000,
          },
        },
        output: {
          start: 1672527600000,
          end: 1672531200000,
        },
      },
    ];
    testData.forEach(
      ({
        input: { interval, binanceKlineOptionalParameters, currentTime },
        output,
      }) => {
        assert.deepEqual(
          BinanceExchange.coerceKlineOptionalParametersToTimeInterval(
            interval,
            binanceKlineOptionalParameters,
            currentTime
          ),
          output
        );
      }
    );
  });
});
