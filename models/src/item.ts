import type { CreationTime } from "./time.js";

type ItemId = string;

export const isItemId = (arg: unknown): arg is ItemId => {
  if (typeof arg !== "string") return false;
  return arg.length === nullId.length;
};

/** An `Item` can have a "key" that associate it to other items. */
export type ItemKey<Key> = Readonly<Key extends object ? Key : never>;

/** An `Item` is identified by its `id`. */
export type Item = ItemKey<{
  id: ItemId;
}>;

export const itemIdCharacters = "abcdefghijklmnopqrstuvwxyz1234567890-";

export const nullId = "00000000-0000-0000-0000-000000000000";

export type NewItem<T extends Item> = T extends Item & CreationTime
  ? Omit<T, "id" | "whenCreated">
  : Omit<T, "id">;
