import { Day, Time, isDay, isTime, now } from "@ggbot2/time";

export type DayKey = { day: Day };

// Create
// ///////////////////////////////////////////////////////////////////

export type CreationDay = {
  creationDay: Day;
};

export type CreationTime = { readonly whenCreated: Time };

export const isCreationDay = (arg: unknown): arg is CreationDay => {
  if (typeof arg !== "object" || arg === null) return false;
  const { creationDay } = arg as Partial<CreationDay>;
  return isDay(creationDay);
};

export const isCreationTime = (arg: unknown): arg is CreationTime => {
  if (typeof arg !== "object" || arg === null) return false;
  const { whenCreated } = arg as Partial<CreationTime>;
  return isTime(whenCreated);
};

export type CreatedNow = () => CreationTime;

export const createdNow: CreatedNow = () => ({ whenCreated: now() });

// Delete
// ///////////////////////////////////////////////////////////////////

export type DeletionTime = { readonly whenDeleted: Time };

export const isDeletionTime = (arg: unknown): arg is DeletionTime => {
  if (typeof arg !== "object" || arg === null) return false;
  const { whenDeleted } = arg as Partial<DeletionTime>;
  return isTime(whenDeleted);
};

export type DeletedNow = () => DeletionTime;

export const deletedNow: DeletedNow = () => ({ whenDeleted: now() });

// Update
// ///////////////////////////////////////////////////////////////////

export type UpdateTime = { readonly whenUpdated: Time };

export const isUpdateTime = (arg: unknown): arg is UpdateTime => {
  if (typeof arg !== "object" || arg === null) return false;
  const { whenUpdated } = arg as Partial<UpdateTime>;
  return isTime(whenUpdated);
};

export type UpdatedNow = () => UpdateTime;

export const updatedNow: UpdatedNow = () => ({ whenUpdated: now() });
