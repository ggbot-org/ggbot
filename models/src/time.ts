import type { Timestamp } from "@ggbot2/time";

export type CreationTime = { readonly whenCreated: Timestamp };

export type DeletionTime = { readonly whenDeleted: Timestamp };

export type UpdateTime = { readonly whenUpdated: Timestamp };
