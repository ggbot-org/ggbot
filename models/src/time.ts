import { Day, Timestamp, isDay, isTimestamp, now } from "@ggbot2/time";

// Create
// ///////////////////////////////////////////////////////////////////

export type CreationDay = {
  creationDay: Day;
};

export type CreationTime = { readonly whenCreated: Timestamp };

export const isCreationDay = (value: unknown): value is CreationDay => {
  if (typeof value !== "object" || value === null) return false;
  const { creationDay } = value as Partial<CreationDay>;
  return isDay(creationDay);
};

export const isCreationTime = (value: unknown): value is CreationTime => {
  if (typeof value !== "object" || value === null) return false;
  const { whenCreated } = value as Partial<CreationTime>;
  return isTimestamp(whenCreated);
};

export type CreatedNow = () => CreationTime;

export const createdNow: CreatedNow = () => ({ whenCreated: now() });

// Delete
// ///////////////////////////////////////////////////////////////////

export type DeletionTime = { readonly whenDeleted: Timestamp };

export const isDeletionTime = (value: unknown): value is DeletionTime => {
  if (typeof value !== "object" || value === null) return false;
  const { whenDeleted } = value as Partial<DeletionTime>;
  return isTimestamp(whenDeleted);
};

export type DeletedNow = () => DeletionTime;

export const deletedNow: DeletedNow = () => ({ whenDeleted: now() });

// Update
// ///////////////////////////////////////////////////////////////////

export type UpdateTime = { readonly whenUpdated: Timestamp };

export const isUpdateTime = (value: unknown): value is UpdateTime => {
  if (typeof value !== "object" || value === null) return false;
  const { whenUpdated } = value as Partial<UpdateTime>;
  return isTimestamp(whenUpdated);
};

export type UpdatedNow = () => UpdateTime;

export const updatedNow: UpdatedNow = () => ({ whenUpdated: now() });
