import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { Frequency, isFrequency } from "./frequency.js"

const schedulingStatuses = ["active", "inactive", "suspended"] as const
export type SchedulingStatus = (typeof schedulingStatuses)[number]

const isSchedulingStatus = isLiteralType<SchedulingStatus>(schedulingStatuses)

export type Scheduling = {
	frequency: Frequency
	status: SchedulingStatus
}

export const isScheduling = objectTypeGuard<Scheduling>(
	({ frequency, status }) =>
		isFrequency(frequency) && isSchedulingStatus(status)
)

export const schedulingsAreInactive = (schedulings: Scheduling[]) => {
	if (schedulings.length === 0) return true
	return schedulings.every(({ status }) => status === "inactive")
}
