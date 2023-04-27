import { isLiteralType } from "@ggbot2/type-utils";
import { Time } from "./time.js";

export const timeUnits = ["second", "minute", "hour", "day"];
export type TimeUnit = (typeof timeUnits)[number];
export const isTimeUnit = isLiteralType<TimeUnit>(timeUnits);

export const coerceToTimeUnit = (arg: string): TimeUnit | undefined => {
  if (isTimeUnit(arg)) return arg;
  if (["1s", "seconds"].includes(arg)) return "second";
  if (["1m", "minutes"].includes(arg)) return "minute";
  if (["1h", "hours"].includes(arg)) return "hour";
  if (["1d", "days"].includes(arg)) return "day";
  return;
};

export const timeUnitDuration: Record<TimeUnit, Time> = {
  second: 1000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
};
