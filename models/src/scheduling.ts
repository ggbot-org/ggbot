import { Frequency, isFrequency } from "./frequency.js";
import { isLiteralType } from "./literalType.js";

export const SchedulingStatuses = ["active", "inactive", "suspended"] as const;
export type SchedulingStatus = typeof SchedulingStatuses[number];

export const isSchedulingStatus =
  isLiteralType<SchedulingStatus>(SchedulingStatuses);

export type Scheduling = {
  frequency: Frequency;
  status: SchedulingStatus;
};

export const isScheduling = (arg: unknown): arg is Scheduling => {
  if (typeof arg !== "object" || arg === null) return false;
  const { frequency, status } = arg as Partial<Scheduling>;
  return isFrequency(frequency) && isSchedulingStatus(status);
};
