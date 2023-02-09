import { Time, TimeUnit, timeUnitDuration } from "@ggbot2/time";
import { NaturalNumber, isLiteralType, isNaturalNumber } from "@ggbot2/type-utils";

export const frequencyIntervals = ["1h", "1m"] as const;
export type FrequencyInterval = typeof frequencyIntervals[number];
export const isFrequencyInterval = isLiteralType<FrequencyInterval>(frequencyIntervals);

export type Frequency = {
  every: NaturalNumber;
  interval: FrequencyInterval;
};

const frequencyIntervalTimeUnit: Record<FrequencyInterval, TimeUnit> = {
  "1m": "minute",
  "1h": "hour",
};

export const frequencyIntervalDuration = ({ every, interval }: Frequency): Time => {
  const timeUnit = frequencyIntervalTimeUnit[interval];
  return timeUnitDuration[timeUnit] * every;
};

export const isFrequency = (arg: unknown): arg is Frequency => {
  if (typeof arg !== "object" || arg === null) return false;
  const { every, interval } = arg as Partial<Frequency>;
  return isNaturalNumber(every) && isFrequencyInterval(interval);
};

export const everyOneHour = (): Frequency => ({ every: 1, interval: "1h" });
