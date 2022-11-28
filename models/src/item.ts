import { randomUUID } from "crypto";
import type { CreationTime } from "./time.js";

type ItemId = string;

export const isItemId = (arg: unknown): arg is ItemId => {
  if (typeof arg !== "string") return false;
  return arg.length === nullId.length || arg.length === nullShortId.length;
};

/** An `Item` can have a "key" that associate it to other items. */
export type ItemKey<Key> = Readonly<Key extends object ? Key : never>;

/** An `Item` is identified by its `id`. */
export type Item = ItemKey<{
  id: ItemId;
}>;

const shortId = (arg: string) => arg.substring(0, 8);

export const nullId = "00000000-0000-0000-0000-000000000000";

export const nullShortId = shortId(nullId);

export const newId = (): ItemId => randomUUID();

export const newShortId = (): ItemId => shortId(randomUUID());

export type NewItem<T extends Item> = T extends Item & CreationTime
  ? Omit<T, "id" | "whenCreated">
  : Omit<T, "id">;
