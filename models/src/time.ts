import { Day, isDay, isTime, now, Time } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

export type DayKey = { day: Day }

// Create.
// //////

export type CreationTime = { readonly whenCreated: Time }

export const isCreationTime = objectTypeGuard<CreationTime>(({ whenCreated }) =>
	isTime(whenCreated)
)

export type CreationDay = {
	creationDay: Day
}

export const isCreationDay = objectTypeGuard<CreationDay>(({ creationDay }) =>
	isDay(creationDay)
)

export type CreatedNow = () => CreationTime

export const createdNow: CreatedNow = () => ({ whenCreated: now() })

// Delete.
// //////

export type DeletionTime = { readonly whenDeleted: Time }

export const isDeletionTime = objectTypeGuard<DeletionTime>(({ whenDeleted }) =>
	isTime(whenDeleted)
)

export type DeletedNow = () => DeletionTime

export const deletedNow: DeletedNow = () => ({ whenDeleted: now() })

// Update.
// //////

export type UpdateTime = { readonly whenUpdated: Time }

export const isUpdateTime = objectTypeGuard<UpdateTime>(({ whenUpdated }) =>
	isTime(whenUpdated)
)

export type UpdatedNow = () => UpdateTime

export const updatedNow: UpdatedNow = () => ({ whenUpdated: now() })
