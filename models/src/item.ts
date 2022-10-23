import { CreationTime } from "./time.js";

type ItemId = string;

export const itemIdCharacters = "abcdefghijklmnopqrstuvwxyz1234567890-";

const nullId = "00000000-0000-0000-0000-000000000000";

export const isItemId = (value: unknown): value is ItemId => {
  if (typeof value !== "string") return false;
  return value.length === nullId.length;
};

/** An Item is identified by its `id`. */
export type Item = {
  readonly id: ItemId;
};

export type NewItem<T extends Item> = T extends Item & CreationTime
  ? Omit<T, "id" | "whenCreated">
  : Omit<T, "id">;
