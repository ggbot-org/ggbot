import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { Frequency, isFrequency } from "./frequency.js"

export const SchedulingStatuses = ["active", "inactive", "suspended"] as const
export type SchedulingStatus = (typeof SchedulingStatuses)[number]

const isSchedulingStatus = isLiteralType<SchedulingStatus>(SchedulingStatuses)

export type Scheduling = {
	frequency: Frequency
	status: SchedulingStatus
}

export const isScheduling = objectTypeGuard<Scheduling>(
	({ frequency, status }) =>
		isFrequency(frequency) && isSchedulingStatus(status)
)
