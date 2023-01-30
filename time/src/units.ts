import { isLiteralType } from "@ggbot2/type-utils";

export const timeUnits = ["second", "minute", "hour", "day"];
export type TimeUnit = typeof timeUnits[number];
export const isTimeUnit = isLiteralType<TimeUnit>(timeUnits);

export const coerceToTimeUnit = (arg: string): TimeUnit | undefined => {
  if (isTimeUnit(arg)) return arg;
  if (["1s", "seconds"]) return "second";
  if (["1m", "minutes"]) return "minute";
  if (["1h", "hours"]) return "hour";
  if (["1d", "days"]) return "day";
  return;
};
