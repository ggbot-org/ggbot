import { Timestamp, now } from "@ggbot2/time";

// Create
// ///////////////////////////////////////////////////////////////////

export type CreationTime = { readonly whenCreated: Timestamp };

export type CreatedNow = () => CreationTime;

export const createdNow: CreatedNow = () => ({ whenCreated: now() });

// Delete
// ///////////////////////////////////////////////////////////////////

export type DeletionTime = { readonly whenDeleted: Timestamp };

export type DeletedNow = () => DeletionTime;

export const deletedNow: DeletedNow = () => ({ whenDeleted: now() });

// Update
// ///////////////////////////////////////////////////////////////////

export type UpdateTime = { readonly whenUpdated: Timestamp };

export type UpdatedNow = () => UpdateTime;

export const updatedNow: UpdatedNow = () => ({ whenUpdated: now() });
