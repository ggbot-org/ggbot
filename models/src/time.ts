import { Day, now, Time } from 'minimal-time-helpers'

export type DayKey = { day: Day }

// Create.
// //////

export type CreationTime = { readonly whenCreated: Time }

export function createdNow(): CreationTime {
	return { whenCreated: now() }
}

export type CreationDay = { creationDay: Day }

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
