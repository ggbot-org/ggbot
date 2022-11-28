import { isLiteralType } from "./literalType.js";
import { NaturalNumber, isNaturalNumber } from "./numbers.js";

export const frequencyIntervals = ["1h"] as const;
export type FrequencyInterval = typeof frequencyIntervals[number];
export const isFrequencyInterval =
  isLiteralType<FrequencyInterval>(frequencyIntervals);

export type Frequency = {
  every: NaturalNumber;
  interval: FrequencyInterval;
};

export const isFrequency = (arg: unknown): arg is Frequency => {
  if (typeof arg !== "object" || arg === null) return false;
  const { every, interval } = arg as Partial<Frequency>;
  return isNaturalNumber(every) && isFrequencyInterval(interval);
};
