/**
 * String with format yyyy-mm-ddThh:mm:ss.lllZ
 */
export type Time = string;

export type CreationTime = { readonly whenCreated: Time };
export type DeletionTime = { readonly whenDeleted: Time };
export type UpdateTime = { readonly whenUpdated: Time };
