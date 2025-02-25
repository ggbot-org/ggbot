import { Day, isDay, isTime, now, Time } from 'minimal-time-helpers'
import { objectTypeGuard } from 'minimal-type-guard-helpers'

export type DayKey = { day: Day }

// Create.
// //////

export type CreationTime = { readonly whenCreated: Time }

export const isCreationTime = objectTypeGuard<CreationTime>(({ whenCreated }) =>
	isTime(whenCreated)
)

export function createdNow(): CreationTime {
	return { whenCreated: now() }
}

export type CreationDay = { creationDay: Day }

export const isCreationDay = objectTypeGuard<CreationDay>(({ creationDay }) =>
	isDay(creationDay)
)

// Delete.
// //////

export type DeletionTime = { readonly whenDeleted: Time }

export function deletedNow(): DeletionTime {
	return { whenDeleted: now() }
}

// Update.
// //////

export type UpdateTime = { readonly whenUpdated: Time }

export function updatedNow(): UpdateTime {
	return { whenUpdated: now() }
}
