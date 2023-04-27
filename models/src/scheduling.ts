import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { Frequency, isFrequency } from "./frequency.js";

export const SchedulingStatuses = ["active", "inactive", "suspended"] as const;
export type SchedulingStatus = (typeof SchedulingStatuses)[number];

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
