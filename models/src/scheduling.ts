import { Frequency, isFrequency } from "./frequency.js";
import { isLiteralType } from "./literalType.js";
import { objectTypeGuard } from "./objects.js";

export const SchedulingStatuses = ["active", "inactive", "suspended"] as const;
export type SchedulingStatus = typeof SchedulingStatuses[number];

export const isSchedulingStatus =
  isLiteralType<SchedulingStatus>(SchedulingStatuses);

export type Scheduling = {
  frequency: Frequency;
  status: SchedulingStatus;
};

export const isScheduling = objectTypeGuard<Scheduling>(
  ({ frequency, status }) =>
    isFrequency(frequency) && isSchedulingStatus(status)
);
