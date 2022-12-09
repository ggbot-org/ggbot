import {
  NaturalNumber,
  isLiteralType,
  isNaturalNumber,
} from "@ggbot2/type-utils";

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
